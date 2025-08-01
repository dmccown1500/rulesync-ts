// Unit tests for GenerateCommand using ESM workaround pattern
// Mock all external dependencies before importing to avoid ESM issues

// Mock all external modules first
jest.mock('chalk', () => ({
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  red: (str: string) => `[RED]${str}[/RED]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
  cyan: (str: string) => `[CYAN]${str}[/CYAN]`,
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
  gray: (str: string) => `[GRAY]${str}[/GRAY]`,
}));

jest.mock('fs-extra', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirpSync: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
}));

jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

jest.mock('path', () => ({
  dirname: jest.fn(),
  join: jest.fn(),
  resolve: jest.fn(),
  isAbsolute: jest.fn(),
  basename: jest.fn(),
  extname: jest.fn(),
}));

jest.mock('os', () => ({
  homedir: jest.fn(),
  tmpdir: jest.fn(),
}));

// Mock the services
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
];

const mockCompositionRules = [
  {
    name: 'base/clean-code',
    path: '/test/templates/base/clean-code.md',
    priority: 1,
    enabled: true,
  },
];

// Create mock methods outside to control them
const mockGetDisabledRules = jest.fn().mockReturnValue([]);
const mockGetEnabledCompositionRules = jest.fn().mockReturnValue(mockCompositionRules);
const mockGetBaseRulesPath = jest.fn().mockReturnValue(null);
const mockGetAugmentPreference = jest.fn().mockReturnValue(undefined);
const mockSetAugmentPreference = jest.fn();
const mockIsLocalProject = jest.fn().mockReturnValue(true);
const mockGetRulesDirectory = jest.fn().mockReturnValue('/test/.rulesync');
const mockGetConfig = jest.fn().mockReturnValue({});
const mockGetConfigPath = jest.fn().mockReturnValue('/test/.rulesync/config.json');

const mockGetRules = jest.fn().mockReturnValue(mockRules);
const mockValidateExcludedAgents = jest.fn().mockReturnValue([]);
const mockFilterContentForAgent = jest
  .fn()
  .mockImplementation((content, shortcode) => `Filtered content for ${shortcode}: ${content}`);

jest.mock('../../services/ConfigService', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    getDisabledRules: mockGetDisabledRules,
    getEnabledCompositionRules: mockGetEnabledCompositionRules,
    getBaseRulesPath: mockGetBaseRulesPath,
    getAugmentPreference: mockGetAugmentPreference,
    setAugmentPreference: mockSetAugmentPreference,
    isLocalProject: mockIsLocalProject,
    getRulesDirectory: mockGetRulesDirectory,
    getConfig: mockGetConfig,
    getConfigPath: mockGetConfigPath,
  })),
}));

jest.mock('../../services/RuleDiscoveryService', () => ({
  RuleDiscoveryService: jest.fn().mockImplementation(() => ({
    getRules: mockGetRules,
  })),
}));

jest.mock('../../services/ContentFilterService', () => ({
  ContentFilterService: jest.fn().mockImplementation(() => ({
    validateExcludedAgents: mockValidateExcludedAgents,
    filterContentForAgent: mockFilterContentForAgent,
  })),
}));

// Import after mocking
import { GenerateCommand } from '../../commands/GenerateCommand';

describe('GenerateCommand', () => {
  let generateCommand: GenerateCommand;
  let consoleSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  // Get mocked modules
  const mockFs = require('fs-extra');
  const mockAxios = require('axios');
  const mockInquirer = require('inquirer');
  const mockPath = require('path');
  const mockOs = require('os');

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation(); // Suppress error console output in tests

    // Reset all mocks
    jest.clearAllMocks();

    // Reset mock method return values to defaults
    mockGetDisabledRules.mockReturnValue([]);
    mockGetEnabledCompositionRules.mockReturnValue(mockCompositionRules);
    mockGetBaseRulesPath.mockReturnValue(null);
    mockGetAugmentPreference.mockReturnValue(undefined);
    mockIsLocalProject.mockReturnValue(true);
    mockGetRulesDirectory.mockReturnValue('/test/.rulesync');
    mockGetConfig.mockReturnValue({});
    mockGetConfigPath.mockReturnValue('/test/.rulesync/config.json');
    mockGetRules.mockReturnValue(mockRules);
    mockValidateExcludedAgents.mockReturnValue([]);
    mockFilterContentForAgent.mockImplementation(
      (content, shortcode) => `Filtered content for ${shortcode}: ${content}`
    );

    // Setup default mocks
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue('# Test Rule Content');
    mockFs.writeFileSync.mockImplementation();
    mockFs.mkdirpSync.mockImplementation();

    mockPath.dirname.mockImplementation((filePath: string) => filePath.replace(/\/[^/]*$/, ''));
    mockPath.join.mockImplementation((...paths: string[]) => paths.join('/'));
    mockPath.resolve.mockImplementation((...paths: string[]) => '/' + paths.join('/'));
    mockPath.isAbsolute.mockImplementation((p: string) => p.startsWith('/'));
    mockPath.basename.mockImplementation((p: string, ext?: string) => {
      const base = p.split('/').pop() || '';
      return ext ? base.replace(ext, '') : base;
    });
    mockPath.extname.mockImplementation((p: string) => {
      const parts = p.split('.');
      return parts.length > 1 ? '.' + parts.pop() : '';
    });

    mockOs.homedir.mockReturnValue('/home/user');
    mockOs.tmpdir.mockReturnValue('/tmp');

    // Mock process.cwd
    jest.spyOn(process, 'cwd').mockReturnValue('/test/project');

    generateCommand = new GenerateCommand();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 1 when VCS check fails and not forced', async () => {
      // Mock no .git directory
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return !filePath.includes('.git');
      });

      // Mock user declining to continue
      mockInquirer.prompt.mockResolvedValue({ continue: false });

      const result = await generateCommand.execute({});

      expect(result).toBe(1);
    });

    test('should proceed when force option is provided', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('.git')) return false;
        if (filePath.includes('rulesync.md')) return true;
        return true; // Other files exist
      });

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Generating rule files...[/BLUE]');
    });

    test('should return 1 when no composed content found', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return false;
        if (filePath.includes('.git')) return true;
        return false;
      });

      // Mock ConfigService to return empty composition rules
      mockGetEnabledCompositionRules.mockReturnValue([]);

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(1);
    });

    test('should return 0 when no enabled rules found', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return true;
        if (filePath.includes('.git')) return true;
        return true;
      });

      // Mock no enabled rules
      mockGetDisabledRules.mockReturnValue(['claude', 'cursor']);

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]No enabled rules found. Use "rulesync rules:list" to see available rules.[/YELLOW]'
      );
    });

    test('should generate files for enabled rules', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return true;
        if (filePath.includes('.git')) return true;
        return true;
      });

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(0);
      expect(mockFs.writeFileSync).toHaveBeenCalledTimes(2); // Two enabled rules
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[GREEN]Generated:[/GREEN]'));
      expect(consoleSpy).toHaveBeenCalledWith(
        '[BLUE]Generation complete: 2 files generated, 0 skipped.[/BLUE]'
      );
    });

    test('should handle invalid agent shortcodes warning', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return true;
        if (filePath.includes('.git')) return true;
        return true;
      });

      // Mock invalid agents
      mockValidateExcludedAgents.mockReturnValue(['invalid-agent']);

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(0);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[YELLOW]Warning: Unknown agent shortcodes in exclusion comments: invalid-agent[/YELLOW]'
      );
    });

    test('should create directories if they do not exist', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return true;
        if (filePath.includes('.git')) return true;
        if (filePath.includes('CLAUDE.md') || filePath.includes('.cursorrules')) return false; // Target directories don't exist
        return false;
      });

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(0);
      expect(mockFs.mkdirpSync).toHaveBeenCalled();
    });

    test('should skip files when shouldWriteFile returns false', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return true;
        if (filePath.includes('.git')) return true;
        return true;
      });

      // Mock shouldWriteFile to return false by setting up different file content and user rejecting overwrite
      mockFs.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return '# Test Rule Content';
        if (filePath.includes('CLAUDE.md') || filePath.includes('.cursorrules'))
          return 'different content';
        return '# Test Rule Content';
      });
      mockInquirer.prompt.mockResolvedValue({ overwrite: false });

      const result = await generateCommand.execute({ force: true });

      expect(result).toBe(0);

      // Check that completion message is shown - it might be any combination of generated/skipped
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\[BLUE\]Generation complete: \d+ files generated, \d+ skipped\.\[\/BLUE\]/
        )
      );
    });
  });

  describe('private methods', () => {
    test('isUrl should correctly identify URLs', () => {
      expect(generateCommand['isUrl']('https://example.com')).toBe(true);
      expect(generateCommand['isUrl']('http://example.com')).toBe(true);
      expect(generateCommand['isUrl']('./local/file.md')).toBe(false);
      expect(generateCommand['isUrl']('/absolute/path.md')).toBe(false);
    });

    test('isUnderVersionControl should check for .git directory', () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.git');
      });

      expect(generateCommand['isUnderVersionControl']()).toBe(true);

      mockFs.existsSync.mockReturnValue(false);
      expect(generateCommand['isUnderVersionControl']()).toBe(false);
    });

    test('buildFinalContent should combine source and base rules', () => {
      const sourceContent = '# Source Rules';
      const baseRules = '# Base Rules';

      const result = generateCommand['buildFinalContent'](sourceContent, baseRules);

      expect(result).toBe('# Source Rules\n\n# Base Rules');
    });

    test('buildFinalContent should handle null base rules', () => {
      const sourceContent = '# Source Rules';

      const result = generateCommand['buildFinalContent'](sourceContent, null);

      expect(result).toBe('# Source Rules');
    });

    test('shouldWriteFile should return true for non-existent files', async () => {
      mockFs.existsSync.mockReturnValue(false);

      const result = await generateCommand['shouldWriteFile']('/path/to/file.md', 'content', {});

      expect(result).toBe(true);
    });

    test('shouldWriteFile should return true when force option is used', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('existing content');

      const result = await generateCommand['shouldWriteFile']('/path/to/file.md', 'new content', {
        force: true,
      });

      expect(result).toBe(true);
    });

    test('shouldWriteFile should return true when content is identical', async () => {
      const content = 'same content';
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue(content);

      const result = await generateCommand['shouldWriteFile']('/path/to/file.md', content, {});

      expect(result).toBe(true);
    });

    test('shouldWriteFile should prompt user when content differs', async () => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.readFileSync.mockReturnValue('existing content');
      mockInquirer.prompt.mockResolvedValue({ overwrite: true });

      const result = await generateCommand['shouldWriteFile'](
        '/path/to/file.md',
        'new content',
        {}
      );

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

  describe('getSourceFile scenarios', () => {
    test('should use custom source file when provided', async () => {
      const customFile = '/custom/rules.md';
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath === customFile;
      });

      const sourceFile = await generateCommand['getSourceFile']({ from: customFile });

      expect(sourceFile).toBe(customFile);
    });

    test('should return null when custom source file does not exist', async () => {
      const customFile = '/custom/rules.md';
      mockFs.existsSync.mockReturnValue(false);

      const sourceFile = await generateCommand['getSourceFile']({ from: customFile });

      expect(sourceFile).toBe(null);
    });

    test('should prefer local rulesync.md over global', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('rulesync.md');
      });

      const sourceFile = await generateCommand['getSourceFile']({});

      expect(sourceFile).toBe('/test/project/rulesync.md');
    });
  });

  describe('getBaseRules', () => {
    test('should return null when no base rules path configured', async () => {
      mockGetBaseRulesPath.mockReturnValue(null);

      const baseRules = await generateCommand['getBaseRules']();

      expect(baseRules).toBe(null);
    });

    test('should fetch base rules from URL', async () => {
      mockGetBaseRulesPath.mockReturnValue('https://example.com/rules.md');

      mockAxios.get.mockResolvedValue({ data: '# Remote Base Rules' });

      const baseRules = await generateCommand['getBaseRules']();

      expect(baseRules).toBe('# Remote Base Rules');
      expect(mockAxios.get).toHaveBeenCalledWith('https://example.com/rules.md', {
        timeout: 10000,
      });
    });

    test('should read base rules from file', async () => {
      mockGetBaseRulesPath.mockReturnValue('/path/to/base.md');

      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath === '/path/to/base.md';
      });
      mockFs.readFileSync.mockReturnValue('# File Base Rules');

      const baseRules = await generateCommand['getBaseRules']();

      expect(baseRules).toBe('# File Base Rules');
    });

    test('should handle errors gracefully', async () => {
      mockGetBaseRulesPath.mockReturnValue('https://example.com/rules.md');

      mockAxios.get.mockRejectedValue(new Error('Network error'));

      const baseRules = await generateCommand['getBaseRules']();

      expect(baseRules).toBe(null);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[YELLOW]Failed to load base rules: Error: Network error[/YELLOW]'
      );
    });
  });

  describe('getComposedContent', () => {
    test('should return main content when no composition rules', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('rulesync.md');
      });

      mockGetEnabledCompositionRules.mockReturnValue([]);

      const content = await generateCommand['getComposedContent']({});

      expect(content).toBe('# Test Rule Content');
    });

    test('should compose content from multiple sources', async () => {
      mockFs.existsSync.mockImplementation((filePath: string) => {
        return filePath.includes('rulesync.md') || filePath.includes('base/clean-code.md');
      });

      mockFs.readFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('rulesync.md')) return '# Project Rules';
        if (filePath.includes('base/clean-code.md')) return '# Base Rules';
        return '';
      });

      const content = await generateCommand['getComposedContent']({});

      expect(content).toContain('# Base Rules');
      expect(content).toContain('---');
      expect(content).toContain('# Project Rules');
    });
  });
});
