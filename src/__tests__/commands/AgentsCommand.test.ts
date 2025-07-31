// Unit tests for AgentsCommand
// Mock all external dependencies to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  red: (str: string) => `[RED]${str}[/RED]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
  cyan: (str: string) => `[CYAN]${str}[/CYAN]`,
}));

// Mock the services with proper return types
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

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getDisabledRules: jest.fn().mockReturnValue(['cursor']),
  })),
}));

jest.mock('../../services/RuleDiscoveryService', () => ({
  RuleDiscoveryService: jest.fn().mockImplementation(() => ({
    getRules: jest.fn().mockReturnValue(mockRules),
  })),
}));

jest.mock('../../commands/EnableCommand', () => ({
  EnableCommand: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(0),
  })),
}));

jest.mock('../../commands/DisableCommand', () => ({
  DisableCommand: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockReturnValue(0),
  })),
}));

// Import after mocking
import { AgentsCommand } from '../../commands/AgentsCommand';

describe('AgentsCommand', () => {
  let agentsCommand: AgentsCommand;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    agentsCommand = new AgentsCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution', () => {
      const result = agentsCommand.execute();
      expect(result).toBe(0);
    });

    test('should display available AI assistants header', () => {
      agentsCommand.execute();
      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Available AI Assistants:[/BLUE]');
    });

    test('should display each agent with correct status', () => {
      agentsCommand.execute();

      // Claude should be enabled (not in disabled list)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Claude → CLAUDE.md ✓'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[GREEN]enabled[/GREEN]'));

      // Cursor should be disabled (in disabled list)
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Cursor → .cursorrules ✗'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[RED]disabled[/RED]'));

      // GitHub Copilot should be enabled
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('GitHub Copilot → .github/copilot-instructions.md ✓')
      );
    });

    test('should display correct summary counts', () => {
      agentsCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('Total: 3 assistants (2 enabled, 1 disabled)');
    });

    test('should display agents with index numbers', () => {
      agentsCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[CYAN][0][/CYAN]'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[CYAN][1][/CYAN]'));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[CYAN][2][/CYAN]'));
    });
  });

  describe('executeEnable', () => {
    test('should return 0 for successful enable', () => {
      const result = agentsCommand.executeEnable('claude');
      expect(result).toBe(0);
    });

    test('should create EnableCommand instance', () => {
      const result = agentsCommand.executeEnable('claude');

      // Should return the result from EnableCommand.execute
      expect(result).toBe(0);

      // Verify EnableCommand was instantiated
      const EnableCommand = require('../../commands/EnableCommand').EnableCommand;
      expect(EnableCommand).toHaveBeenCalled();
    });
  });

  describe('executeDisable', () => {
    test('should return 0 for successful disable', () => {
      const result = agentsCommand.executeDisable('cursor');
      expect(result).toBe(0);
    });

    test('should create DisableCommand instance', () => {
      const result = agentsCommand.executeDisable('cursor');

      // Should return the result from DisableCommand.execute
      expect(result).toBe(0);

      // Verify DisableCommand was instantiated
      const DisableCommand = require('../../commands/DisableCommand').DisableCommand;
      expect(DisableCommand).toHaveBeenCalled();
    });
  });
});
