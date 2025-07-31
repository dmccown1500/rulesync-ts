// Unit tests for DisableCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
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
const mockGetRuleByShortcode = jest.fn();
const mockGetDisabledRules = jest.fn().mockReturnValue([]);
const mockDisableRule = jest.fn();

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getDisabledRules: mockGetDisabledRules,
    disableRule: mockDisableRule,
  })),
}));

jest.mock('../../services/RuleDiscoveryService', () => ({
  RuleDiscoveryService: jest.fn().mockImplementation(() => ({
    getRules: mockGetRules,
    getRuleByShortcode: mockGetRuleByShortcode,
  })),
}));

// Import after mocking
import { DisableCommand } from '../../commands/DisableCommand';

describe('DisableCommand', () => {
  let disableCommand: DisableCommand;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetRules.mockReturnValue(mockRules);
    mockGetRuleByShortcode.mockReturnValue(null);
    mockGetDisabledRules.mockReturnValue([]);
    mockDisableRule.mockImplementation();

    disableCommand = new DisableCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution by rule index', () => {
      const result = disableCommand.execute('0', false); // Disable first rule (Claude)

      expect(result).toBe(0);
      expect(mockDisableRule).toHaveBeenCalledWith('claude');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Disabled rule: Claude (claude)[/GREEN]');
    });

    test('should return 0 for successful execution by shortcode', () => {
      mockGetRuleByShortcode.mockReturnValue(mockRules[1]); // Return Cursor rule

      const result = disableCommand.execute('cursor', false);

      expect(result).toBe(0);
      expect(mockDisableRule).toHaveBeenCalledWith('cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Disabled rule: Cursor (cursor)[/GREEN]');
    });

    test('should show deprecation warning by default', () => {
      const result = disableCommand.execute('0');

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]⚠️  DEPRECATED: The "disable" command is deprecated and will be removed in a future version.[/YELLOW]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]   Please use "agents disable" instead.[/YELLOW]'
      );
    });

    test('should suppress deprecation warning when requested', () => {
      const result = disableCommand.execute('0', false);

      expect(result).toBe(0);
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('DEPRECATED'));
    });

    test('should return 1 when rule is not found by index', () => {
      const result = disableCommand.execute('999', false); // Invalid index

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]Rule not found: 999[/RED]');
      expect(consoleSpy).toHaveBeenCalledWith('Use "rulesync agents" to see available agents.');
      expect(mockDisableRule).not.toHaveBeenCalled();
    });

    test('should return 1 when rule is not found by shortcode', () => {
      mockGetRuleByShortcode.mockReturnValue(null); // Rule not found

      const result = disableCommand.execute('nonexistent', false);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]Rule not found: nonexistent[/RED]');
      expect(consoleSpy).toHaveBeenCalledWith('Use "rulesync agents" to see available agents.');
      expect(mockDisableRule).not.toHaveBeenCalled();
    });

    test('should return 0 when rule is already disabled', () => {
      mockGetDisabledRules.mockReturnValue(['claude']); // Claude is already disabled

      const result = disableCommand.execute('0', false);

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]Rule "Claude" is already disabled.[/YELLOW]'
      );
      expect(mockDisableRule).not.toHaveBeenCalled();
    });

    test('should handle negative index gracefully', () => {
      const result = disableCommand.execute('-1', false);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]Rule not found: -1[/RED]');
    });

    test('should handle non-numeric string as shortcode lookup', () => {
      mockGetRuleByShortcode.mockReturnValue(mockRules[2]); // Return Copilot rule

      const result = disableCommand.execute('copilot', false);

      expect(result).toBe(0);
      expect(mockGetRuleByShortcode).toHaveBeenCalledWith('copilot');
      expect(mockDisableRule).toHaveBeenCalledWith('copilot');
      expect(consoleSpy).toHaveBeenCalledWith(
        '[GREEN]Disabled rule: GitHub Copilot (copilot)[/GREEN]'
      );
    });

    test('should handle edge case of rule index as string', () => {
      const result = disableCommand.execute('1', false); // Should disable Cursor (index 1)

      expect(result).toBe(0);
      expect(mockDisableRule).toHaveBeenCalledWith('cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Disabled rule: Cursor (cursor)[/GREEN]');
    });

    test('should not call getRuleByShortcode when valid index is provided', () => {
      const result = disableCommand.execute('0', false);

      expect(result).toBe(0);
      expect(mockGetRuleByShortcode).not.toHaveBeenCalled();
      expect(mockDisableRule).toHaveBeenCalledWith('claude');
    });
  });
});
