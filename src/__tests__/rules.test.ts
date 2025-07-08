import { Claude, Cursor, Windsurf } from '../rules';

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
});
