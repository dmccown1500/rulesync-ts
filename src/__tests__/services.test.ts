import { RuleDiscoveryService } from '../services/RuleDiscoveryService';

describe('Services', () => {
  describe('RuleDiscoveryService', () => {
    let ruleDiscovery: RuleDiscoveryService;

    beforeEach(() => {
      ruleDiscovery = new RuleDiscoveryService();
    });

    test('should return all 8 rules', () => {
      const rules = ruleDiscovery.getRules();
      expect(rules).toHaveLength(8);
    });

    test('should return rules with correct shortcodes', () => {
      const rules = ruleDiscovery.getRules();
      const shortcodes = rules.map(rule => rule.shortcode());
      
      expect(shortcodes).toContain('claude');
      expect(shortcodes).toContain('cursor');
      expect(shortcodes).toContain('windsurf');
      expect(shortcodes).toContain('gemini');
      expect(shortcodes).toContain('copilot');
      expect(shortcodes).toContain('cline');
      expect(shortcodes).toContain('junie');
      expect(shortcodes).toContain('codex');
    });

    test('should find rule by shortcode', () => {
      const claudeRule = ruleDiscovery.getRuleByShortcode('claude');
      expect(claudeRule).toBeDefined();
      expect(claudeRule?.name()).toBe('Claude');
      expect(claudeRule?.shortcode()).toBe('claude');
    });

    test('should return undefined for non-existent shortcode', () => {
      const nonExistentRule = ruleDiscovery.getRuleByShortcode('nonexistent');
      expect(nonExistentRule).toBeUndefined();
    });

    test('should return rules with correct names', () => {
      const rules = ruleDiscovery.getRules();
      const names = rules.map(rule => rule.name());
      
      expect(names).toContain('Claude');
      expect(names).toContain('Cursor');
      expect(names).toContain('Windsurf');
      expect(names).toContain('Gemini CLI');
      expect(names).toContain('GitHub Copilot');
      expect(names).toContain('Cline');
      expect(names).toContain('Junie');
      expect(names).toContain('OpenAI Codex');
    });

    test('should return rules with correct file paths', () => {
      const rules = ruleDiscovery.getRules();
      const paths = rules.map(rule => rule.path());
      
      expect(paths).toContain('CLAUDE.md');
      expect(paths).toContain('.cursorrules');
      expect(paths).toContain('.windsurfrules');
      expect(paths).toContain('GEMINI.md');
      expect(paths).toContain('.github/copilot-instructions.md');
      expect(paths).toContain('.clinerules/project.md');
      expect(paths).toContain('.junie/guidelines.md');
      expect(paths).toContain('AGENTS.md');
    });
  });
});
