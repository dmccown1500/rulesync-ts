// Unit tests for ConfigCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  cyan: (str: string) => `[CYAN]${str}[/CYAN]`,
}));

// Create mock methods outside to control them
const mockGetConfig = jest.fn().mockReturnValue({});
const mockGetConfigPath = jest.fn().mockReturnValue('/test/.rulesync/config.json');
const mockIsLocalProject = jest.fn().mockReturnValue(true);

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getConfig: mockGetConfig,
    getConfigPath: mockGetConfigPath,
    isLocalProject: mockIsLocalProject,
  })),
}));

// Import after mocking
import { ConfigCommand } from '../../commands/ConfigCommand';

describe('ConfigCommand', () => {
  let configCommand: ConfigCommand;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetConfig.mockReturnValue({});
    mockGetConfigPath.mockReturnValue('/test/.rulesync/config.json');
    mockIsLocalProject.mockReturnValue(true);

    configCommand = new ConfigCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution', () => {
      const result = configCommand.execute();
      expect(result).toBe(0);
    });

    test('should display current configuration header', () => {
      configCommand.execute();
      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Current Configuration:[/BLUE]');
    });

    test('should display config file path', () => {
      configCommand.execute();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN]Config file:[/CYAN] /test/.rulesync/config.json'
      );
    });

    test('should display local project type', () => {
      mockIsLocalProject.mockReturnValue(true);

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Project type:[/CYAN] Local');
    });

    test('should display global project type', () => {
      mockIsLocalProject.mockReturnValue(false);

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Project type:[/CYAN] Global');
    });

    test('should display disabled agents when they exist', () => {
      mockGetConfig.mockReturnValue({
        disabled_rules: ['cursor', 'copilot'],
      });

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Disabled agents:[/CYAN] cursor, copilot');
    });

    test('should display "None" when no disabled agents exist', () => {
      mockGetConfig.mockReturnValue({
        disabled_rules: [],
      });

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Disabled agents:[/CYAN] None');
    });

    test('should display "None" when disabled_rules is undefined', () => {
      mockGetConfig.mockReturnValue({});

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Disabled agents:[/CYAN] None');
    });

    test('should display base rules path when set', () => {
      mockGetConfig.mockReturnValue({
        base_rules_path: 'https://example.com/rules.md',
      });

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN]Base rules path:[/CYAN] https://example.com/rules.md'
      );
    });

    test('should display "Not set" when base rules path is not configured', () => {
      mockGetConfig.mockReturnValue({});

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Base rules path:[/CYAN] Not set');
    });

    test('should display augment preference when set to true', () => {
      mockGetConfig.mockReturnValue({
        augment: true,
      });

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN]Augment preference:[/CYAN] Combine local and global'
      );
    });

    test('should display augment preference when set to false', () => {
      mockGetConfig.mockReturnValue({
        augment: false,
      });

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Augment preference:[/CYAN] Use local only');
    });

    test('should display "Not set" when augment preference is undefined', () => {
      mockGetConfig.mockReturnValue({});

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN]Augment preference:[/CYAN] Not set (will prompt)'
      );
    });

    test('should display complete configuration with all options set', () => {
      mockGetConfig.mockReturnValue({
        disabled_rules: ['cursor'],
        base_rules_path: '/path/to/base.md',
        augment: true,
      });
      mockGetConfigPath.mockReturnValue('/custom/.rulesync/config.json');
      mockIsLocalProject.mockReturnValue(false);

      configCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Current Configuration:[/BLUE]');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN]Config file:[/CYAN] /custom/.rulesync/config.json'
      );
      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Project type:[/CYAN] Global');
      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Disabled agents:[/CYAN] cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Base rules path:[/CYAN] /path/to/base.md');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN]Augment preference:[/CYAN] Combine local and global'
      );
    });
  });
});
