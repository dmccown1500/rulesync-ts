// Unit tests for BaseCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  red: (str: string) => `[RED]${str}[/RED]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
}));

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
}));

// Create mock methods outside to control them
const mockGetBaseRulesPath = jest.fn().mockReturnValue(null);
const mockSetBaseRulesPath = jest.fn();

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getBaseRulesPath: mockGetBaseRulesPath,
    setBaseRulesPath: mockSetBaseRulesPath,
  })),
}));

// Import after mocking
import { BaseCommand } from '../../commands/BaseCommand';

describe('BaseCommand', () => {
  let baseCommand: BaseCommand;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  // Get mocked modules
  const mockFs = require('fs-extra');

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetBaseRulesPath.mockReturnValue(null);
    mockSetBaseRulesPath.mockImplementation();

    // Setup default mocks
    mockFs.existsSync.mockReturnValue(true);

    baseCommand = new BaseCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution', () => {
      const result = baseCommand.execute();
      expect(result).toBe(0);
    });

    describe('when no path is provided', () => {
      test('should show current base rules path when set', () => {
        mockGetBaseRulesPath.mockReturnValue('/path/to/base/rules.md');

        const result = baseCommand.execute();

        expect(result).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith(
          '[BLUE]Current base rules path: /path/to/base/rules.md[/BLUE]'
        );
      });

      test('should show message when no base rules path is set', () => {
        mockGetBaseRulesPath.mockReturnValue(null);

        const result = baseCommand.execute();

        expect(result).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]No base rules path set.[/YELLOW]');
      });

      test('should show message when base rules path is empty string', () => {
        mockGetBaseRulesPath.mockReturnValue('');

        const result = baseCommand.execute();

        expect(result).toBe(0);
        expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]No base rules path set.[/YELLOW]');
      });
    });

    describe('when path is provided', () => {
      test('should set base rules path for valid file path', () => {
        mockFs.existsSync.mockReturnValue(true);

        const result = baseCommand.execute('/path/to/rules.md');

        expect(result).toBe(0);
        expect(mockSetBaseRulesPath).toHaveBeenCalledWith('/path/to/rules.md');
        expect(consoleSpy).toHaveBeenCalledWith(
          '[GREEN]Set base rules path to: /path/to/rules.md[/GREEN]'
        );
      });

      test('should set base rules path for valid URL', () => {
        const url = 'https://example.com/rules.md';

        const result = baseCommand.execute(url);

        expect(result).toBe(0);
        expect(mockSetBaseRulesPath).toHaveBeenCalledWith(url);
        expect(consoleSpy).toHaveBeenCalledWith(`[GREEN]Set base rules path to: ${url}[/GREEN]`);
        // Should not check file existence for URLs
        expect(mockFs.existsSync).not.toHaveBeenCalled();
      });

      test('should return 1 when file path does not exist', () => {
        mockFs.existsSync.mockReturnValue(false);

        const result = baseCommand.execute('/nonexistent/path.md');

        expect(result).toBe(1);
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[RED]Base rules file not found: /nonexistent/path.md[/RED]'
        );
        expect(mockSetBaseRulesPath).not.toHaveBeenCalled();
      });

      test('should handle relative file paths', () => {
        mockFs.existsSync.mockReturnValue(true);

        const result = baseCommand.execute('./local-rules.md');

        expect(result).toBe(0);
        expect(mockSetBaseRulesPath).toHaveBeenCalledWith('./local-rules.md');
        expect(consoleSpy).toHaveBeenCalledWith(
          '[GREEN]Set base rules path to: ./local-rules.md[/GREEN]'
        );
      });

      test('should handle HTTP URLs', () => {
        const url = 'http://example.com/rules.md';

        const result = baseCommand.execute(url);

        expect(result).toBe(0);
        expect(mockSetBaseRulesPath).toHaveBeenCalledWith(url);
        expect(consoleSpy).toHaveBeenCalledWith(`[GREEN]Set base rules path to: ${url}[/GREEN]`);
      });

      test('should handle FTP URLs', () => {
        const url = 'ftp://example.com/rules.md';

        const result = baseCommand.execute(url);

        expect(result).toBe(0);
        expect(mockSetBaseRulesPath).toHaveBeenCalledWith(url);
        expect(consoleSpy).toHaveBeenCalledWith(`[GREEN]Set base rules path to: ${url}[/GREEN]`);
      });

      test('should validate non-URL paths for existence', () => {
        mockFs.existsSync.mockReturnValue(false);

        const result = baseCommand.execute('not-a-url.md');

        expect(result).toBe(1);
        expect(mockFs.existsSync).toHaveBeenCalledWith('not-a-url.md');
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[RED]Base rules file not found: not-a-url.md[/RED]'
        );
      });
    });
  });

  describe('private methods', () => {
    test('isUrl should correctly identify HTTPS URLs', () => {
      expect(baseCommand['isUrl']('https://example.com')).toBe(true);
      expect(baseCommand['isUrl']('https://example.com/path/file.md')).toBe(true);
    });

    test('isUrl should correctly identify HTTP URLs', () => {
      expect(baseCommand['isUrl']('http://example.com')).toBe(true);
      expect(baseCommand['isUrl']('http://example.com/path/file.md')).toBe(true);
    });

    test('isUrl should correctly identify FTP URLs', () => {
      expect(baseCommand['isUrl']('ftp://example.com')).toBe(true);
      expect(baseCommand['isUrl']('ftp://example.com/file.md')).toBe(true);
    });

    test('isUrl should return false for non-URLs', () => {
      expect(baseCommand['isUrl']('./local/file.md')).toBe(false);
      expect(baseCommand['isUrl']('/absolute/path.md')).toBe(false);
      expect(baseCommand['isUrl']('relative/path.md')).toBe(false);
      expect(baseCommand['isUrl']('just-a-filename.md')).toBe(false);
      expect(baseCommand['isUrl']('')).toBe(false);
    });

    test('isUrl should handle edge cases', () => {
      // The URL constructor accepts custom protocols, so this is actually valid
      expect(baseCommand['isUrl']('not-a-protocol://example.com')).toBe(true);
      expect(baseCommand['isUrl']('https://')).toBe(false);
      expect(baseCommand['isUrl']('://example.com')).toBe(false);
    });
  });
});