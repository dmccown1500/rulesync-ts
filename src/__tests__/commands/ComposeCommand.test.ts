// Unit tests for ComposeCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  red: (str: string) => `[RED]${str}[/RED]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
  cyan: (str: string) => `[CYAN]${str}[/CYAN]`,
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
  magenta: (str: string) => `[MAGENTA]${str}[/MAGENTA]`,
  gray: (str: string) => `[GRAY]${str}[/GRAY]`,
}));

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  readdir: jest.fn(),
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
  resolve: jest.fn(),
  isAbsolute: jest.fn(),
  basename: jest.fn(),
  extname: jest.fn(),
}));

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

// Mock composition rules data
const mockCompositionRules = [
  {
    name: 'existing-rule',
    path: '/existing/rule.md',
    priority: 1,
    enabled: true,
  },
];

// Create mock methods outside to control them
const mockGetCompositionRules = jest.fn().mockReturnValue([]);
const mockGetEnabledCompositionRules = jest.fn().mockReturnValue([]);
const mockRemoveCompositionRule = jest.fn();
const mockAddCompositionRule = jest.fn();

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getCompositionRules: mockGetCompositionRules,
    getEnabledCompositionRules: mockGetEnabledCompositionRules,
    removeCompositionRule: mockRemoveCompositionRule,
    addCompositionRule: mockAddCompositionRule,
  })),
}));

// Import after mocking
import { ComposeCommand } from '../../commands/ComposeCommand';

describe('ComposeCommand', () => {
  let composeCommand: ComposeCommand;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  // Get mocked modules
  const mockFs = require('fs-extra');
  const mockPath = require('path');
  const mockInquirer = require('inquirer');
  const mockAxios = require('axios');

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation(); // Suppress warn output in tests

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetCompositionRules.mockReturnValue([]);
    mockGetEnabledCompositionRules.mockReturnValue([]);
    mockRemoveCompositionRule.mockImplementation();
    mockAddCompositionRule.mockImplementation();

    // Setup default mocks for fs-extra
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue('# Test rule content');
    mockFs.writeFileSync.mockImplementation();
    mockFs.readdir.mockResolvedValue([]);
    mockFs.readFile.mockResolvedValue('# Test content');

    // Setup default mocks for path
    mockPath.join.mockImplementation((...paths: string[]) => paths.join('/'));
    mockPath.resolve.mockImplementation((...paths: string[]) => {
      if (paths[0] === '/test/project') {
        return paths.join('/');
      }
      return '/' + paths.join('/');
    });
    mockPath.isAbsolute.mockImplementation((p: string) => p.startsWith('/'));
    mockPath.basename.mockImplementation((p: string, ext?: string) => {
      const base = p.split('/').pop() || '';
      return ext ? base.replace(ext, '') : base;
    });
    mockPath.extname.mockImplementation((p: string) => {
      const parts = p.split('.');
      return parts.length > 1 ? '.' + parts.pop() : '';
    });

    // Setup default mocks for other modules
    mockInquirer.prompt.mockResolvedValue({ overwrite: true });
    mockAxios.get.mockResolvedValue({ data: '# Remote rule content' });

    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/test/project');

    composeCommand = new ComposeCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 1 when no rule identifiers provided', async () => {
      const result = await composeCommand.execute([]);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]No rule identifiers provided[/RED]');
      expect(consoleSpy).toHaveBeenCalledWith('Usage: rulesync compose <rule1> <rule2> ...');
    });

    test('should show usage examples when no identifiers provided', async () => {
      await composeCommand.execute([]);

      expect(consoleSpy).toHaveBeenCalledWith('Examples:');
      expect(consoleSpy).toHaveBeenCalledWith(
        '  [CYAN]rulesync compose base clean-code react typescript[/CYAN]'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        '  [CYAN]rulesync compose ./my-base.md ./templates/react-typescript.md[/CYAN]'
      );
    });

    test('should clear existing composition rules before adding new ones', async () => {
      mockGetCompositionRules.mockReturnValue(mockCompositionRules);
      mockGetEnabledCompositionRules.mockReturnValue([{
        name: 'test',
        path: '/test/project/test.md',
        priority: 1,
        enabled: true
      }]);
      
      // Mock successful file resolution
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath === '/test/project/test.md' || filePath === '/test/project/rulesync.md';
      });

      const result = await composeCommand.execute(['/test/project/test.md']);

      expect(result).toBe(0);
      expect(mockRemoveCompositionRule).toHaveBeenCalledWith('existing-rule');
    });

    test('should handle absolute file path rule identifiers', async () => {
      mockGetEnabledCompositionRules.mockReturnValue([{
        name: 'test-rule',
        path: '/absolute/path/test-rule.md',
        priority: 1,
        enabled: true
      }]);

      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath === '/absolute/path/test-rule.md' || filePath === '/test/project/rulesync.md';
      });

      const result = await composeCommand.execute(['/absolute/path/test-rule.md']);

      expect(result).toBe(0);
      expect(mockAddCompositionRule).toHaveBeenCalledWith({
        name: 'test-rule',
        path: '/absolute/path/test-rule.md',
        priority: 1,
        enabled: true,
      });
    });

    test('should handle relative file path rule identifiers', async () => {
      mockGetEnabledCompositionRules.mockReturnValue([{
        name: 'my-rule',
        path: '/test/project/my-rule.md',
        priority: 1,
        enabled: true
      }]);

      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('my-rule.md') || filePath === '/test/project/rulesync.md';
      });

      const result = await composeCommand.execute(['./my-rule.md']);

      expect(result).toBe(0);
      expect(mockAddCompositionRule).toHaveBeenCalled();
    });

    // Template resolution is complex and requires extensive directory mocking
    // The basic functionality is covered by other tests

    test('should handle single matching template files', async () => {
      mockGetEnabledCompositionRules.mockReturnValue([{
        name: 'typescript',
        path: '/test/project/templates/language/typescript.md',
        priority: 1,
        enabled: true
      }]);

      // Mock templates directory doesn't exist, but we find files via recursive search
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath === '/test/project/templates') return true;
        if (filePath === '/test/project/templates/language/typescript.md') return true;
        if (filePath === '/test/project/rulesync.md') return true;
        return false;
      });

      // Mock readdir to simulate directory structure
      mockFs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === '/test/project/templates') {
          return [
            { name: 'language', isDirectory: () => true, isFile: () => false }
          ];
        }
        if (dirPath === '/test/project/templates/language') {
          return [
            { name: 'typescript.md', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      const result = await composeCommand.execute(['typescript']);

      expect(result).toBe(0);
      expect(mockAddCompositionRule).toHaveBeenCalledWith({
        name: 'typescript',
        path: '/test/project/templates/language/typescript.md',
        priority: 1,
        enabled: true,
      });
    });

    test('should return 1 when rule resolution fails', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = await composeCommand.execute(['nonexistent-rule']);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[RED]Failed to resolve rule: nonexistent-rule[/RED]'
      );
    });

    test('should assign correct priorities to multiple rules', async () => {
      mockGetEnabledCompositionRules.mockReturnValue([
        { name: 'rule1', path: '/path1.md', priority: 1, enabled: true },
        { name: 'rule2', path: '/path2.md', priority: 2, enabled: true },
        { name: 'rule3', path: '/path3.md', priority: 3, enabled: true }
      ]);

      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.md');
      });

      const result = await composeCommand.execute(['/path1.md', '/path2.md', '/path3.md']);

      expect(result).toBe(0);
      expect(mockAddCompositionRule).toHaveBeenCalledTimes(3);

      // Check priorities are assigned correctly
      const calls = mockAddCompositionRule.mock.calls;
      expect(calls[0][0].priority).toBe(1);
      expect(calls[1][0].priority).toBe(2);
      expect(calls[2][0].priority).toBe(3);
    });

    test('should handle multiple matches gracefully', async () => {
      // Mock templates directory exists and has multiple matching files
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath === '/test/project/templates') return true;
        return filePath.includes('react');
      });

      // Mock readdir to simulate multiple matching files  
      mockFs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === '/test/project/templates') {
          return [
            { name: 'framework', isDirectory: () => true, isFile: () => false }
          ];
        }
        if (dirPath === '/test/project/templates/framework') {
          return [
            { name: 'react.md', isDirectory: () => false, isFile: () => true },
            { name: 'react-native.md', isDirectory: () => false, isFile: () => true }
          ];
        }
        return [];
      });

      const result = await composeCommand.execute(['react']);

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[YELLOW]Multiple matches found for "react":[/YELLOW]'
      );
    });
  });

  describe('generateRulesyncFile', () => {
    test('should return 1 when no composition rules configured', async () => {
      mockGetEnabledCompositionRules.mockReturnValue([]);

      const result = await composeCommand['generateRulesyncFile']();

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]No composition rules configured[/RED]');
    });

    test('should generate rulesync.md file with composed content', async () => {
      const mockRules = [
        { name: 'rule1', path: '/path1.md', priority: 1, enabled: true }
      ];
      
      mockGetEnabledCompositionRules.mockReturnValue(mockRules);
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath !== '/test/project/rulesync.md'; // rulesync.md doesn't exist, but rule files do
      });

      const result = await composeCommand['generateRulesyncFile']();

      expect(result).toBe(0);
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/rulesync.md',
        expect.stringContaining('# Test rule content')
      );
    });

    test('should handle URL-based composition rules', async () => {
      const mockRules = [
        { name: 'remote-rule', path: 'https://example.com/rule.md', priority: 1, enabled: true }
      ];
      
      mockGetEnabledCompositionRules.mockReturnValue(mockRules);
      mockFs.existsSync.mockReturnValue(false);
      mockAxios.get.mockResolvedValue({ data: '# Remote content' });

      const result = await composeCommand['generateRulesyncFile']();

      expect(result).toBe(0);
      expect(mockAxios.get).toHaveBeenCalledWith('https://example.com/rule.md', { timeout: 10000 });
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '/test/project/rulesync.md',
        '# Remote content'
      );
    });

    test('should skip generation when user declines overwrite', async () => {
      const mockRules = [
        { name: 'rule1', path: '/path1.md', priority: 1, enabled: true }
      ];
      
      mockGetEnabledCompositionRules.mockReturnValue(mockRules);
      
      mockFs.existsSync.mockImplementation(() => {
        return true; // All files exist
      });
      
      mockFs.readFileSync.mockImplementation((filePath: string) => {
        if (filePath === '/test/project/rulesync.md') {
          return 'Different existing content'; // Different from what we'd write
        }
        return '# Test rule content';
      });
      
      mockInquirer.prompt.mockResolvedValue({ overwrite: false });

      const result = await composeCommand['generateRulesyncFile']();

      expect(result).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]Skipped:[/YELLOW] /test/project/rulesync.md');
    });

    test('should handle errors in composition rule loading', async () => {
      const mockRules = [
        { name: 'bad-rule', path: '/nonexistent.md', priority: 1, enabled: true }
      ];
      
      mockGetEnabledCompositionRules.mockReturnValue(mockRules);
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath !== '/nonexistent.md'; // This file doesn't exist
      });

      const result = await composeCommand['generateRulesyncFile']();

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[RED]No valid composition rule content found[/RED]');
    });
  });

  describe('listAvailableTemplates', () => {
    test('should return 0 when no templates directory found', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await composeCommand.listAvailableTemplates();

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('[YELLOW]No templates directory found[/YELLOW]');
    });

    test('should list available templates organized by folder', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('templates');
      });

      mockFs.readdir.mockImplementation(async (dirPath: string) => {
        if (dirPath === '/test/project/templates/base') {
          return ['clean-code.md', 'README.md'];
        }
        if (dirPath === '/test/project/templates/language') {
          return ['typescript.md', 'python.md'];
        }
        return [];
      });

      mockFs.readFile.mockImplementation(async (filePath: string) => {
        if (filePath.includes('clean-code.md')) {
          return '# Clean Code Principles\nRobert Martin\'s clean code rules';
        }
        return '# Default title';
      });

      const result = await composeCommand.listAvailableTemplates();

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Available templates:[/BLUE]');
      expect(consoleSpy).toHaveBeenCalledWith('[MAGENTA]base/[/MAGENTA]');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('base/clean-code'));
    });
  });

  describe('private methods', () => {
    test('isUrl should correctly identify URLs', () => {
      expect(composeCommand['isUrl']('https://example.com')).toBe(true);
      expect(composeCommand['isUrl']('http://example.com')).toBe(true);
      expect(composeCommand['isUrl']('./local/file.md')).toBe(false);
      expect(composeCommand['isUrl']('/absolute/path.md')).toBe(false);
    });

    test('resolveCompositionRulePath should handle URLs', () => {
      const url = 'https://example.com/rule.md';
      const result = composeCommand['resolveCompositionRulePath'](url);
      expect(result).toBe(url);
    });

    test('resolveCompositionRulePath should handle absolute paths', () => {
      const absolutePath = '/absolute/path/rule.md';
      const result = composeCommand['resolveCompositionRulePath'](absolutePath);
      expect(result).toBe(absolutePath);
    });

    test('resolveCompositionRulePath should resolve relative paths', () => {
      const relativePath = './relative/rule.md';
      const result = composeCommand['resolveCompositionRulePath'](relativePath);
      expect(result).toBe('/test/project/./relative/rule.md');
    });

    test('createCompositionRule should create correct rule object', () => {
      const result = composeCommand['createCompositionRule']('/path/to/file.md', 'test-rule', 5);
      
      expect(result).toEqual({
        name: 'test-rule',
        path: '/path/to/file.md',
        priority: 5,
        enabled: true,
      });
    });

    test('shouldWriteFile should return true for non-existent files', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await composeCommand['shouldWriteFile']('/path/to/file.md', 'content', {});
      expect(result).toBe(true);
    });

    test('shouldWriteFile should return true when force option is used', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('existing content');

      const result = await composeCommand['shouldWriteFile']('/path/to/file.md', 'new content', { force: true });
      expect(result).toBe(true);
    });

    test('shouldWriteFile should return true when content is identical', async () => {
      const content = 'same content';
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(content);

      const result = await composeCommand['shouldWriteFile']('/path/to/file.md', content, {});
      expect(result).toBe(true);
    });

    test('shouldWriteFile should prompt user when content differs', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('existing content');
      mockInquirer.prompt.mockResolvedValue({ overwrite: true });

      const result = await composeCommand['shouldWriteFile']('/path/to/file.md', 'new content', {});
      
      expect(result).toBe(true);
      expect(mockInquirer.prompt).toHaveBeenCalledWith([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'File exists and is different: /path/to/file.md. Overwrite?',
          default: false,
        },
      ]);
    });
  });
});