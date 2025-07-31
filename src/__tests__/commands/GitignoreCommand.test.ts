// Unit tests for GitignoreCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
}));

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

// Mock rules data
const mockRules = [
  {
    name: () => 'Claude',
    shortcode: () => 'claude',
    path: () => 'CLAUDE.md',
    gitignorePath: () => 'CLAUDE.md',
  },
  {
    name: () => 'Cursor',
    shortcode: () => 'cursor',
    path: () => '.cursorrules',
    gitignorePath: () => '.cursorrules',
  },
];

// Create mock methods outside to control them
const mockGetDisabledRules = jest.fn().mockReturnValue([]);
const mockGetRules = jest.fn().mockReturnValue(mockRules);

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getDisabledRules: mockGetDisabledRules,
  })),
}));

jest.mock('../../services/RuleDiscoveryService', () => ({
  RuleDiscoveryService: jest.fn().mockImplementation(() => ({
    getRules: mockGetRules,
  })),
}));

// Import after mocking
import { GitignoreCommand } from '../../commands/GitignoreCommand';

describe('GitignoreCommand', () => {
  let gitignoreCommand: GitignoreCommand;
  let consoleSpy: jest.SpyInstance;

  // Get mocked modules
  const mockFs = require('fs-extra');
  const mockPath = require('path');

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetDisabledRules.mockReturnValue([]);
    mockGetRules.mockReturnValue(mockRules);

    // Setup default mocks
    mockFs.existsSync.mockReturnValue(false);
    mockFs.readFileSync.mockReturnValue('');
    mockFs.writeFileSync.mockImplementation();

    mockPath.join.mockImplementation((...paths: string[]) => paths.join('/'));

    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/test/project');

    gitignoreCommand = new GitignoreCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution', () => {
      const result = gitignoreCommand.execute();
      expect(result).toBe(0);
    });

    test('should return 0 when no enabled rules found', () => {
      mockGetDisabledRules.mockReturnValue(['claude', 'cursor']); // All rules disabled

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]No enabled rules found. Use "rulesync rules:list" to see available rules.[/YELLOW]'
      );
    });

    test('should create new .gitignore when it does not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('# Rulesync - AI Assistant Rules')
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('CLAUDE.md')
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('.cursorrules')
      );
    });

    test('should read existing .gitignore when it exists', () => {
      const existingContent = '# Existing content\nnode_modules/\n';
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(existingContent);

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(mockFs.readFileSync).toHaveBeenCalledWith('/test/project/.gitignore', 'utf8');
    });

    test('should replace existing rulesync section in .gitignore', () => {
      const existingContent = `# Existing content
node_modules/

# Rulesync - AI Assistant Rules
old-rule.md
# End Rulesync

# More content`;

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(existingContent);

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('# Existing content')
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('CLAUDE.md')
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('# More content')
      );
    });

    test('should append rulesync section when no existing section found', () => {
      const existingContent = '# Existing content\nnode_modules/\n';
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(existingContent);

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining(existingContent)
      );
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('# Rulesync - AI Assistant Rules')
      );
    });

    test('should only include enabled rules in .gitignore', () => {
      mockGetDisabledRules.mockReturnValue(['cursor']); // Only cursor disabled

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      const writeCall = mockFs.writeFileSync.mock.calls[0];
      const writtenContent = writeCall[1];

      expect(writtenContent).toContain('CLAUDE.md'); // Claude is enabled
      expect(writtenContent).not.toContain('.cursorrules'); // Cursor is disabled
    });

    test('should display success message with count of rules', () => {
      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[GREEN]Updated .gitignore with 2 AI assistant rule files.[/GREEN]'
      );
    });

    test('should build rulesync section with proper formatting', () => {
      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      const writeCall = mockFs.writeFileSync.mock.calls[0];
      const writtenContent = writeCall[1];

      expect(writtenContent).toContain('# Rulesync - AI Assistant Rules');
      expect(writtenContent).toContain('# End Rulesync');
      expect(writtenContent).toContain('CLAUDE.md');
      expect(writtenContent).toContain('.cursorrules');
    });

    test('should handle empty rules list gracefully', () => {
      mockGetRules.mockReturnValue([]);

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]No enabled rules found. Use "rulesync rules:list" to see available rules.[/YELLOW]'
      );
    });

    test('should handle malformed existing rulesync section', () => {
      const existingContent = `# Existing content
# Rulesync - AI Assistant Rules
old-rule.md
# This section has no end marker
# More content`;

      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(existingContent);

      const result = gitignoreCommand.execute();

      expect(result).toBe(0);
      // Should append new section since end marker not found
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/.gitignore',
        expect.stringContaining('# Rulesync - AI Assistant Rules')
      );
    });
  });
});