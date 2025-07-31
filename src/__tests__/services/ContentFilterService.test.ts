import { ContentFilterService } from '../../services/ContentFilterService';

describe('ContentFilterService', () => {
  let contentFilter: ContentFilterService;

  beforeEach(() => {
    contentFilter = new ContentFilterService();
  });

  describe('filterContentForAgent', () => {
    test('should return original content when no exclusion blocks exist', () => {
      const content = `# General Rules

Always use TypeScript
Write comprehensive tests

## Code Style
Use meaningful variable names`;

      const result = contentFilter.filterContentForAgent(content, 'claude');
      expect(result).toBe(content);
    });

    test('should exclude content for specified agent', () => {
      const content = `# General Rules

Always use TypeScript

<!-- exclude: cursor, windsurf -->
Use specific linting configuration
Only for certain agents
<!-- /exclude -->

Write comprehensive tests`;

      const result = contentFilter.filterContentForAgent(content, 'cursor');
      const expected = `# General Rules

Always use TypeScript

Write comprehensive tests`;

      expect(result.trim()).toBe(expected.trim());
    });

    test('should include content for non-excluded agents', () => {
      const content = `# General Rules

Always use TypeScript

<!-- exclude: cursor, windsurf -->
Use specific linting configuration
Only for certain agents
<!-- /exclude -->

Write comprehensive tests`;

      const result = contentFilter.filterContentForAgent(content, 'claude');
      const expected = `# General Rules

Always use TypeScript

Use specific linting configuration
Only for certain agents
Write comprehensive tests`;

      expect(result.trim()).toBe(expected.trim());
    });

    test('should handle multiple exclusion blocks', () => {
      const content = `# General Rules

Always use TypeScript

<!-- exclude: cursor -->
Cursor specific exclusion
<!-- /exclude -->

Write comprehensive tests

<!-- exclude: claude, gemini -->
Claude and Gemini exclusion
<!-- /exclude -->

Final rule`;

      const resultCursor = contentFilter.filterContentForAgent(content, 'cursor');
      const expectedCursor = `# General Rules

Always use TypeScript

Write comprehensive tests

Claude and Gemini exclusion
Final rule`;

      const resultClaude = contentFilter.filterContentForAgent(content, 'claude');
      const expectedClaude = `# General Rules

Always use TypeScript

Cursor specific exclusion
Write comprehensive tests

Final rule`;

      expect(resultCursor.trim()).toBe(expectedCursor.trim());
      expect(resultClaude.trim()).toBe(expectedClaude.trim());
    });

    test('should handle nested content within exclusion blocks', () => {
      const content = `# Rules

<!-- exclude: cursor -->
## Special Section

- Point 1
- Point 2

### Subsection
More detailed content here
<!-- /exclude -->

End`;

      const resultCursor = contentFilter.filterContentForAgent(content, 'cursor');
      const expectedCursor = `# Rules

End`;

      const resultClaude = contentFilter.filterContentForAgent(content, 'claude');
      const expectedClaude = `# Rules

## Special Section

- Point 1
- Point 2

### Subsection
More detailed content here
End`;

      expect(resultCursor.trim()).toBe(expectedCursor.trim());
      expect(resultClaude.trim()).toBe(expectedClaude.trim());
    });

    test('should be case insensitive for agent names', () => {
      const content = `# Rules

<!-- exclude: CURSOR, WindSurf -->
Case insensitive test
<!-- /exclude -->

End`;

      const resultCursor = contentFilter.filterContentForAgent(content, 'cursor');
      const resultWindsurf = contentFilter.filterContentForAgent(content, 'windsurf');
      const resultClaude = contentFilter.filterContentForAgent(content, 'claude');

      expect(resultCursor.trim()).toBe('# Rules\n\nEnd');
      expect(resultWindsurf.trim()).toBe('# Rules\n\nEnd');
      expect(resultClaude).toContain('Case insensitive test');
    });

    test('should handle whitespace in agent lists', () => {
      const content = `# Rules

<!-- exclude:   cursor   ,    windsurf   -->
Whitespace test
<!-- /exclude -->

End`;

      const resultCursor = contentFilter.filterContentForAgent(content, 'cursor');
      const resultWindsurf = contentFilter.filterContentForAgent(content, 'windsurf');

      expect(resultCursor.trim()).toBe('# Rules\n\nEnd');
      expect(resultWindsurf.trim()).toBe('# Rules\n\nEnd');
    });

    test('should warn about unmatched exclude start tags', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const content = `# Rules

<!-- exclude: cursor -->
Unmatched start tag

End`;

      const result = contentFilter.filterContentForAgent(content, 'cursor');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Found exclude start tag without matching end tag')
      );
      expect(result).toBe(content); // Content should remain unchanged

      consoleWarnSpy.mockRestore();
    });
  });

  describe('getExcludedAgentsInContent', () => {
    test('should return empty array when no exclusions exist', () => {
      const content = `# Rules
Just normal content`;

      const result = contentFilter.getExcludedAgentsInContent(content);
      expect(result).toEqual([]);
    });

    test('should return list of all excluded agents', () => {
      const content = `# Rules

<!-- exclude: cursor, windsurf -->
Block 1
<!-- /exclude -->

<!-- exclude: claude -->
Block 2
<!-- /exclude -->

<!-- exclude: cursor, gemini -->
Block 3
<!-- /exclude -->`;

      const result = contentFilter.getExcludedAgentsInContent(content);
      expect(result.sort()).toEqual(['claude', 'cursor', 'gemini', 'windsurf']);
    });

    test('should deduplicate agent names', () => {
      const content = `# Rules

<!-- exclude: cursor, windsurf -->
Block 1
<!-- /exclude -->

<!-- exclude: cursor, claude -->
Block 2
<!-- /exclude -->`;

      const result = contentFilter.getExcludedAgentsInContent(content);
      expect(result.sort()).toEqual(['claude', 'cursor', 'windsurf']);
    });
  });

  describe('validateExcludedAgents', () => {
    test('should return empty array when all agents are valid', () => {
      const content = `# Rules

<!-- exclude: cursor, claude -->
Content
<!-- /exclude -->`;

      const validShortcodes = ['cursor', 'claude', 'windsurf', 'gemini'];
      const result = contentFilter.validateExcludedAgents(content, validShortcodes);

      expect(result).toEqual([]);
    });

    test('should return invalid agent names', () => {
      const content = `# Rules

<!-- exclude: cursor, invalid1, claude, invalid2 -->
Content
<!-- /exclude -->`;

      const validShortcodes = ['cursor', 'claude', 'windsurf', 'gemini'];
      const result = contentFilter.validateExcludedAgents(content, validShortcodes);

      expect(result.sort()).toEqual(['invalid1', 'invalid2']);
    });

    test('should be case insensitive for validation', () => {
      const content = `# Rules

<!-- exclude: CURSOR, Claude -->
Content
<!-- /exclude -->`;

      const validShortcodes = ['cursor', 'claude', 'windsurf', 'gemini'];
      const result = contentFilter.validateExcludedAgents(content, validShortcodes);

      expect(result).toEqual([]);
    });
  });

  describe('content cleanup', () => {
    test('should remove excessive blank lines', () => {
      const content = `# Rules

<!-- exclude: cursor -->
Excluded content
<!-- /exclude -->



Extra blank lines`;

      const result = contentFilter.filterContentForAgent(content, 'cursor');

      // Should not have more than 2 consecutive newlines
      expect(result).not.toMatch(/\n{4,}/);
      expect(result.trim()).toBe('# Rules\n\nExtra blank lines');
    });

    test('should trim leading and trailing whitespace', () => {
      const content = `   

<!-- exclude: cursor -->
Excluded content
<!-- /exclude -->

   `;

      const result = contentFilter.filterContentForAgent(content, 'cursor');
      expect(result).toBe('');
    });
  });

  describe('complex scenarios', () => {
    test('should handle real-world example with mixed content', () => {
      const content = `# AI Assistant Rules

You are a helpful AI assistant. Please follow these guidelines:

1. Always be concise and clear in your responses
2. Provide accurate information

<!-- exclude: cursor, windsurf -->
## IDE-Specific Rules

These rules only apply to Claude and other non-IDE assistants:
- Don't assume IDE context
- Provide complete code examples
- Explain file structure when needed
<!-- /exclude -->

## Code Guidelines

- Use TypeScript when possible
- Follow clean code principles

<!-- exclude: gemini -->
## Advanced Features

Use these advanced TypeScript features:
- Conditional types
- Template literal types
<!-- /exclude -->

## Communication Style

- Be friendly but professional`;

      const resultCursor = contentFilter.filterContentForAgent(content, 'cursor');
      const resultClaude = contentFilter.filterContentForAgent(content, 'claude');
      const resultGemini = contentFilter.filterContentForAgent(content, 'gemini');

      // Cursor should not have IDE-specific rules
      expect(resultCursor).not.toContain('IDE-Specific Rules');
      expect(resultCursor).not.toContain("Don't assume IDE context");
      expect(resultCursor).toContain('Advanced Features'); // Should have advanced features

      // Claude should have IDE-specific rules but not advanced features for Gemini exclusion
      expect(resultClaude).toContain('IDE-Specific Rules');
      expect(resultClaude).toContain("Don't assume IDE context");
      expect(resultClaude).toContain('Advanced Features');

      // Gemini should have IDE-specific rules but not advanced features
      expect(resultGemini).toContain('IDE-Specific Rules');
      expect(resultGemini).not.toContain('Advanced Features');
      expect(resultGemini).not.toContain('Conditional types');

      // All should have common content
      expect(resultCursor).toContain('Communication Style');
      expect(resultClaude).toContain('Communication Style');
      expect(resultGemini).toContain('Communication Style');
    });
  });
});
