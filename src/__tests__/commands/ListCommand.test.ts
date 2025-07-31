// Unit tests for ListCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  cyan: (str: string) => `[CYAN]${str}[/CYAN]`,
  red: (str: string) => `[RED]${str}[/RED]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
}));

// Mock rules data
const mockRules = [
  {
    name: () => 'Claude',
    shortcode: () => 'claude',
    path: () => 'CLAUDE.md',
  },
  {
    name: () => 'Cursor',
    shortcode: () => 'cursor',
    path: () => '.cursorrules',
  },
  {
    name: () => 'GitHub Copilot',
    shortcode: () => 'copilot',
    path: () => '.github/copilot-instructions.md',
  },
];

// Create mock methods outside to control them
const mockGetRules = jest.fn().mockReturnValue(mockRules);
const mockGetDisabledRules = jest.fn().mockReturnValue(['cursor']);

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
import { ListCommand } from '../../commands/ListCommand';

describe('ListCommand', () => {
  let listCommand: ListCommand;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetRules.mockReturnValue(mockRules);
    mockGetDisabledRules.mockReturnValue(['cursor']);

    listCommand = new ListCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution', () => {
      const result = listCommand.execute();
      expect(result).toBe(0);
    });

    test('should display deprecation warning', () => {
      listCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]⚠️  DEPRECATED: The "rules:list" command is deprecated and will be removed in a future version.[/YELLOW]'
      );
      expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]   Please use "agents" instead.[/YELLOW]');
    });

    test('should display available AI assistants header', () => {
      listCommand.execute();
      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Available AI Assistants:[/BLUE]');
    });

    test('should display each agent with correct format and status', () => {
      listCommand.execute();

      // Claude should be enabled (not in disabled list)
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][0][/CYAN] Claude → CLAUDE.md ✓ [GREEN]enabled[/GREEN]'
      );

      // Cursor should be disabled (in disabled list)
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][1][/CYAN] Cursor → .cursorrules ✗ [RED]disabled[/RED]'
      );

      // Copilot should be enabled (not in disabled list)
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][2][/CYAN] GitHub Copilot → .github/copilot-instructions.md ✓ [GREEN]enabled[/GREEN]'
      );
    });

    test('should display total count summary', () => {
      listCommand.execute();

      // 3 total, 1 disabled (cursor), 2 enabled
      expect(consoleSpy).toHaveBeenCalledWith('Total: 3 assistants (2 enabled, 1 disabled)');
    });

    test('should handle all rules disabled', () => {
      mockGetDisabledRules.mockReturnValue(['claude', 'cursor', 'copilot']);

      listCommand.execute();

      // All should show as disabled
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][0][/CYAN] Claude → CLAUDE.md ✗ [RED]disabled[/RED]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][1][/CYAN] Cursor → .cursorrules ✗ [RED]disabled[/RED]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][2][/CYAN] GitHub Copilot → .github/copilot-instructions.md ✗ [RED]disabled[/RED]'
      );

      // Summary: 3 total, 3 disabled, 0 enabled
      expect(consoleSpy).toHaveBeenCalledWith('Total: 3 assistants (0 enabled, 3 disabled)');
    });

    test('should handle no rules disabled', () => {
      mockGetDisabledRules.mockReturnValue([]);

      listCommand.execute();

      // All should show as enabled
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][0][/CYAN] Claude → CLAUDE.md ✓ [GREEN]enabled[/GREEN]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][1][/CYAN] Cursor → .cursorrules ✓ [GREEN]enabled[/GREEN]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][2][/CYAN] GitHub Copilot → .github/copilot-instructions.md ✓ [GREEN]enabled[/GREEN]'
      );

      // Summary: 3 total, 0 disabled, 3 enabled
      expect(consoleSpy).toHaveBeenCalledWith('Total: 3 assistants (3 enabled, 0 disabled)');
    });

    test('should handle empty rules list', () => {
      mockGetRules.mockReturnValue([]);
      mockGetDisabledRules.mockReturnValue([]);

      listCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Available AI Assistants:[/BLUE]');
      expect(consoleSpy).toHaveBeenCalledWith('Total: 0 assistants (0 enabled, 0 disabled)');
    });

    test('should handle single rule scenario', () => {
      const singleRule = [mockRules[0]]; // Just Claude
      mockGetRules.mockReturnValue(singleRule);
      mockGetDisabledRules.mockReturnValue([]);

      listCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][0][/CYAN] Claude → CLAUDE.md ✓ [GREEN]enabled[/GREEN]'
      );
      expect(consoleSpy).toHaveBeenCalledWith('Total: 1 assistants (1 enabled, 0 disabled)');
    });

    test('should properly calculate enabled/disabled counts', () => {
      // Test with partial disabled list
      mockGetDisabledRules.mockReturnValue(['cursor', 'copilot']); // 2 disabled, 1 enabled

      listCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('Total: 3 assistants (1 enabled, 2 disabled)');
    });

    test('should display rules in the order they are returned', () => {
      const reorderedRules = [mockRules[2], mockRules[0], mockRules[1]]; // Copilot, Claude, Cursor
      mockGetRules.mockReturnValue(reorderedRules);
      mockGetDisabledRules.mockReturnValue(['cursor']);

      listCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][0][/CYAN] GitHub Copilot → .github/copilot-instructions.md ✓ [GREEN]enabled[/GREEN]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][1][/CYAN] Claude → CLAUDE.md ✓ [GREEN]enabled[/GREEN]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[CYAN][2][/CYAN] Cursor → .cursorrules ✗ [RED]disabled[/RED]'
      );
    });
  });
});
