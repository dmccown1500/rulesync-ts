// Unit tests for EnableCommand using ESM workaround pattern
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
const mockGetDisabledRules = jest.fn().mockReturnValue(['cursor']); // Cursor is disabled by default
const mockEnableRule = jest.fn();

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getDisabledRules: mockGetDisabledRules,
    enableRule: mockEnableRule,
  })),
}));

jest.mock('../../services/RuleDiscoveryService', () => ({
  RuleDiscoveryService: jest.fn().mockImplementation(() => ({
    getRules: mockGetRules,
    getRuleByShortcode: mockGetRuleByShortcode,
  })),
}));

// Import after mocking
import { EnableCommand } from '../../commands/EnableCommand';

describe('EnableCommand', () => {
  let enableCommand: EnableCommand;
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
    mockGetDisabledRules.mockReturnValue(['cursor']); // Cursor is disabled by default
    mockEnableRule.mockImplementation();

    enableCommand = new EnableCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution by rule index', () => {
      const result = enableCommand.execute('1', false); // Enable second rule (Cursor, which is disabled)

      expect(result).toBe(0);
      expect(mockEnableRule).toHaveBeenCalledWith('cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Enabled rule: Cursor (cursor)[/GREEN]');
    });

    test('should return 0 for successful execution by shortcode', () => {
      mockGetRuleByShortcode.mockReturnValue(mockRules[1]); // Return Cursor rule

      const result = enableCommand.execute('cursor', false);

      expect(result).toBe(0);
      expect(mockEnableRule).toHaveBeenCalledWith('cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Enabled rule: Cursor (cursor)[/GREEN]');
    });

    test('should show deprecation warning by default', () => {
      const result = enableCommand.execute('1');

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]⚠️  DEPRECATED: The "enable" command is deprecated and will be removed in a future version.[/YELLOW]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]   Please use "agents enable" instead.[/YELLOW]'
      );
    });

    test('should suppress deprecation warning when requested', () => {
      const result = enableCommand.execute('1', false);

      expect(result).toBe(0);
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('DEPRECATED'));
    });

    test('should return 1 when rule is not found by index', () => {
      const result = enableCommand.execute('999', false); // Invalid index

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]Rule not found: 999[/RED]');
      expect(consoleSpy).toHaveBeenCalledWith('Use "rulesync agents" to see available agents.');
      expect(mockEnableRule).not.toHaveBeenCalled();
    });

    test('should return 1 when rule is not found by shortcode', () => {
      mockGetRuleByShortcode.mockReturnValue(null); // Rule not found

      const result = enableCommand.execute('nonexistent', false);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]Rule not found: nonexistent[/RED]');
      expect(consoleSpy).toHaveBeenCalledWith('Use "rulesync agents" to see available agents.');
      expect(mockEnableRule).not.toHaveBeenCalled();
    });

    test('should return 0 when rule is already enabled', () => {
      mockGetDisabledRules.mockReturnValue([]); // No rules disabled, so Claude (index 0) is enabled

      const result = enableCommand.execute('0', false);

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]Rule "Claude" is already enabled.[/YELLOW]');
      expect(mockEnableRule).not.toHaveBeenCalled();
    });

    test('should handle negative index gracefully', () => {
      const result = enableCommand.execute('-1', false);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]Rule not found: -1[/RED]');
    });

    test('should handle non-numeric string as shortcode lookup', () => {
      mockGetRuleByShortcode.mockReturnValue(mockRules[1]); // Return Cursor rule

      const result = enableCommand.execute('cursor', false);

      expect(result).toBe(0);
      expect(mockGetRuleByShortcode).toHaveBeenCalledWith('cursor');
      expect(mockEnableRule).toHaveBeenCalledWith('cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Enabled rule: Cursor (cursor)[/GREEN]');
    });

    test('should handle edge case of rule index as string', () => {
      const result = enableCommand.execute('1', false); // Should enable Cursor (index 1)

      expect(result).toBe(0);
      expect(mockEnableRule).toHaveBeenCalledWith('cursor');
      expect(consoleSpy).toHaveBeenCalledWith('[GREEN]Enabled rule: Cursor (cursor)[/GREEN]');
    });

    test('should not call getRuleByShortcode when valid index is provided', () => {
      const result = enableCommand.execute('1', false);

      expect(result).toBe(0);
      expect(mockGetRuleByShortcode).not.toHaveBeenCalled();
      expect(mockEnableRule).toHaveBeenCalledWith('cursor');
    });

    test('should handle enabling already enabled rule by shortcode', () => {
      mockGetRuleByShortcode.mockReturnValue(mockRules[0]); // Return Claude rule (not in disabled list)
      mockGetDisabledRules.mockReturnValue(['cursor']); // Only cursor is disabled

      const result = enableCommand.execute('claude', false);

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]Rule "Claude" is already enabled.[/YELLOW]');
      expect(mockEnableRule).not.toHaveBeenCalled();
    });
  });
});
