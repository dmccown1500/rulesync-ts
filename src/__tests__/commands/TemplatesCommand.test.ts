// Unit tests for TemplatesCommand
// Mock all external dependencies to avoid ESM issues

// Mock chalk
jest.mock('chalk', () => ({
  blue: (str: string) => `[BLUE]${str}[/BLUE]`,
  cyan: (str: string) => `[CYAN]${str}[/CYAN]`,
  green: (str: string) => `[GREEN]${str}[/GREEN]`,
  white: (str: string) => `[WHITE]${str}[/WHITE]`,
  gray: (str: string) => `[GRAY]${str}[/GRAY]`,
  yellow: (str: string) => `[YELLOW]${str}[/YELLOW]`,
  red: (str: string) => `[RED]${str}[/RED]`,
}));

// Mock fs
const mockReaddirSync = jest.fn();
const mockStatSync = jest.fn();

jest.mock('fs', () => ({
  readdirSync: mockReaddirSync,
  statSync: mockStatSync,
}));

// Mock path
jest.mock('path', () => ({
  join: (...paths: string[]) => paths.join('/'),
}));

// Mock process.cwd
const originalCwd = process.cwd;
beforeAll(() => {
  process.cwd = jest.fn().mockReturnValue('/test/project');
});

afterAll(() => {
  process.cwd = originalCwd;
});

// Import after mocking
import { TemplatesCommand } from '../../commands/TemplatesCommand';

describe('TemplatesCommand', () => {
  let templatesCommand: TemplatesCommand;
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    templatesCommand = new TemplatesCommand();

    // Reset mocks
    mockReaddirSync.mockClear();
    mockStatSync.mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    test('should return 0 for successful execution', () => {
      // Mock empty directory
      mockReaddirSync.mockReturnValue([]);

      const result = templatesCommand.execute();
      expect(result).toBe(0);
    });

    test('should display templates header', () => {
      mockReaddirSync.mockReturnValue([]);

      templatesCommand.execute();
      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Available Templates:[/BLUE]');
    });

    test('should display no templates message when directory is empty', () => {
      mockReaddirSync.mockReturnValue([]);

      templatesCommand.execute();
      expect(consoleSpy).toHaveBeenCalledWith(
        '[YELLOW]No templates found. Make sure you have a templates/ directory.[/YELLOW]'
      );
    });

    test('should display templates when available', () => {
      // Mock directory structure
      mockReaddirSync
        .mockReturnValueOnce(['base', 'language']) // templates directory
        .mockReturnValueOnce(['clean-code.md', 'security.md']) // base directory
        .mockReturnValueOnce(['typescript.md', 'python.md']); // language directory

      mockStatSync.mockReturnValue({ isDirectory: () => true });

      templatesCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Base:[/CYAN]');
      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Language:[/CYAN]');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[GREEN\]•\[\/GREEN\].*\[WHITE\]base\/clean-code\[\/WHITE\]/)
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[GREEN\]•\[\/GREEN\].*\[WHITE\]language\/typescript\[\/WHITE\]/)
      );
    });

    test('should display usage section when templates exist', () => {
      // Mock directory structure with templates
      mockReaddirSync
        .mockReturnValueOnce(['base']) // templates directory
        .mockReturnValueOnce(['clean-code.md']); // base directory

      mockStatSync.mockReturnValue({ isDirectory: () => true });

      templatesCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[BLUE]Usage:[/BLUE]');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[YELLOW]rulesync compose base/clean-code[/YELLOW]')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[YELLOW]rulesync compose base/clean-code react[/YELLOW]')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[YELLOW]rulesync compose /path/to/custom.md[/YELLOW]')
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[YELLOW]rulesync compose[/YELLOW]')
      );
    });

    test('should show note about compose functionality when templates exist', () => {
      // Mock directory structure with templates
      mockReaddirSync
        .mockReturnValueOnce(['base']) // templates directory
        .mockReturnValueOnce(['clean-code.md']); // base directory

      mockStatSync.mockReturnValue({ isDirectory: () => true });

      templatesCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[GRAY]Note: compose works with templates, file paths, or URLs[/GRAY]'
      );
    });

    test('should handle errors gracefully', () => {
      // Mock console.log to throw an error during execution
      consoleSpy.mockImplementation(() => {
        throw new Error('Console error');
      });

      const result = templatesCommand.execute();

      expect(result).toBe(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[RED]Error reading templates directory:[/RED]',
        expect.any(Error)
      );
    });

    test('should filter out non-markdown files', () => {
      mockReaddirSync
        .mockReturnValueOnce(['base']) // templates directory
        .mockReturnValueOnce(['clean-code.md', 'README.txt', 'config.json', 'typescript.md']); // base directory

      mockStatSync.mockReturnValue({ isDirectory: () => true });

      templatesCommand.execute();

      // Should only show .md files
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/base\/clean-code/));
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/base\/typescript/));

      // Should not show non-.md files
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringMatching(/README\.txt/));
      expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringMatching(/config\.json/));
    });

    test('should skip directories with no markdown files', () => {
      mockReaddirSync
        .mockReturnValueOnce(['base', 'empty']) // templates directory
        .mockReturnValueOnce(['clean-code.md']) // base directory
        .mockReturnValueOnce(['README.txt', 'config.json']); // empty directory (no .md files)

      mockStatSync.mockReturnValue({ isDirectory: () => true });

      templatesCommand.execute();

      expect(consoleSpy).toHaveBeenCalledWith('[CYAN]Base:[/CYAN]');
      expect(consoleSpy).not.toHaveBeenCalledWith('[CYAN]Empty:[/CYAN]');
    });
  });

  describe('getTemplateDescription', () => {
    test('should return correct descriptions for known templates', () => {
      const description1 = templatesCommand['getTemplateDescription']('base', 'clean-code.md');
      expect(description1).toBe("Robert Martin's Clean Code principles");

      const description2 = templatesCommand['getTemplateDescription']('language', 'typescript.md');
      expect(description2).toBe('TypeScript best practices and patterns');

      const description3 = templatesCommand['getTemplateDescription']('framework', 'react.md');
      expect(description3).toBe('React component and hook patterns');
    });

    test('should return default description for unknown templates', () => {
      const description = templatesCommand['getTemplateDescription']('unknown', 'unknown.md');
      expect(description).toBe('Coding guidelines and best practices');
    });

    test('should return default description for unknown category', () => {
      const description = templatesCommand['getTemplateDescription'](
        'unknown-category',
        'clean-code.md'
      );
      expect(description).toBe('Coding guidelines and best practices');
    });

    test('should handle missing template in known category', () => {
      const description = templatesCommand['getTemplateDescription']('base', 'unknown.md');
      expect(description).toBe('Coding guidelines and best practices');
    });
  });

  describe('getTemplateCategories', () => {
    test('should return empty object when no categories exist', () => {
      mockReaddirSync.mockReturnValue([]);

      const categories = templatesCommand['getTemplateCategories']();
      expect(categories).toEqual({});
    });

    test('should return categories with templates', () => {
      mockReaddirSync
        .mockReturnValueOnce(['base', 'language']) // templates directory
        .mockReturnValueOnce(['clean-code.md', 'security.md']) // base directory
        .mockReturnValueOnce(['typescript.md']); // language directory

      mockStatSync.mockReturnValue({ isDirectory: () => true });

      const categories = templatesCommand['getTemplateCategories']();

      expect(categories).toEqual({
        base: ['clean-code.md', 'security.md'],
        language: ['typescript.md'],
      });
    });

    test('should handle directory read errors gracefully', () => {
      mockReaddirSync.mockImplementation(() => {
        throw new Error('Directory not found');
      });

      const categories = templatesCommand['getTemplateCategories']();
      expect(categories).toEqual({});
    });
  });
});
