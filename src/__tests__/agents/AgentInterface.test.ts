import {
  Claude,
  Cursor,
  Windsurf,
  Gemini,
  GitHubCopilot,
  Cline,
  Junie,
  OpenAICodex,
} from '../../agents';

describe('Rules', () => {
  describe('Claude', () => {
    const claude = new Claude();

    test('should have correct name', () => {
      expect(claude.name()).toBe('Claude');
    });

    test('should have correct shortcode', () => {
      expect(claude.shortcode()).toBe('claude');
    });

    test('should have correct path', () => {
      expect(claude.path()).toBe('CLAUDE.md');
    });

    test('should have correct gitignore path', () => {
      expect(claude.gitignorePath()).toBe('CLAUDE.md');
    });
  });

  describe('Cursor', () => {
    const cursor = new Cursor();

    test('should have correct name', () => {
      expect(cursor.name()).toBe('Cursor');
    });

    test('should have correct shortcode', () => {
      expect(cursor.shortcode()).toBe('cursor');
    });

    test('should have correct path', () => {
      expect(cursor.path()).toBe('.cursorrules');
    });

    test('should have correct gitignore path', () => {
      expect(cursor.gitignorePath()).toBe('.cursorrules');
    });
  });

  describe('Windsurf', () => {
    const windsurf = new Windsurf();

    test('should have correct name', () => {
      expect(windsurf.name()).toBe('Windsurf');
    });

    test('should have correct shortcode', () => {
      expect(windsurf.shortcode()).toBe('windsurf');
    });

    test('should have correct path', () => {
      expect(windsurf.path()).toBe('.windsurfrules');
    });

    test('should have correct gitignore path', () => {
      expect(windsurf.gitignorePath()).toBe('.windsurfrules');
    });
  });

  describe('Gemini', () => {
    const gemini = new Gemini();

    test('should have correct name', () => {
      expect(gemini.name()).toBe('Gemini CLI');
    });

    test('should have correct shortcode', () => {
      expect(gemini.shortcode()).toBe('gemini');
    });

    test('should have correct path', () => {
      expect(gemini.path()).toBe('GEMINI.md');
    });

    test('should have correct gitignore path', () => {
      expect(gemini.gitignorePath()).toBe('GEMINI.md');
    });
  });

  describe('GitHubCopilot', () => {
    const copilot = new GitHubCopilot();

    test('should have correct name', () => {
      expect(copilot.name()).toBe('GitHub Copilot');
    });

    test('should have correct shortcode', () => {
      expect(copilot.shortcode()).toBe('copilot');
    });

    test('should have correct path', () => {
      expect(copilot.path()).toBe('.github/copilot-instructions.md');
    });

    test('should have correct gitignore path', () => {
      expect(copilot.gitignorePath()).toBe('.github/copilot-instructions.md');
    });
  });

  describe('Cline', () => {
    const cline = new Cline();

    test('should have correct name', () => {
      expect(cline.name()).toBe('Cline');
    });

    test('should have correct shortcode', () => {
      expect(cline.shortcode()).toBe('cline');
    });

    test('should have correct path', () => {
      expect(cline.path()).toBe('.clinerules/project.md');
    });

    test('should have correct gitignore path', () => {
      expect(cline.gitignorePath()).toBe('.clinerules/project.md');
    });
  });

  describe('Junie', () => {
    const junie = new Junie();

    test('should have correct name', () => {
      expect(junie.name()).toBe('Junie');
    });

    test('should have correct shortcode', () => {
      expect(junie.shortcode()).toBe('junie');
    });

    test('should have correct path', () => {
      expect(junie.path()).toBe('.junie/guidelines.md');
    });

    test('should have correct gitignore path', () => {
      expect(junie.gitignorePath()).toBe('.junie/guidelines.md');
    });
  });

  describe('OpenAICodex', () => {
    const codex = new OpenAICodex();

    test('should have correct name', () => {
      expect(codex.name()).toBe('OpenAI Codex');
    });

    test('should have correct shortcode', () => {
      expect(codex.shortcode()).toBe('codex');
    });

    test('should have correct path', () => {
      expect(codex.path()).toBe('AGENTS.md');
    });

    test('should have correct gitignore path', () => {
      expect(codex.gitignorePath()).toBe('AGENTS.md');
    });
  });
});
