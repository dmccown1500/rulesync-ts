import * as fs from 'fs-extra';
import { ConfigService } from '../../services/ConfigService';
import type { CompositionRule } from '../../types';

// Mock fs-extra
jest.mock('fs-extra');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('ConfigService', () => {
  let configService: ConfigService;
  let tempDir: string;
  let originalCwd: string;
  let mockConfig: Record<string, unknown>;

  beforeEach(() => {
    // Setup test environment
    originalCwd = process.cwd();
    tempDir = '/test/temp';
    mockConfig = {};

    // Mock file system
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(mockConfig));
    mockFs.writeFileSync.mockImplementation((_path, content) => {
      mockConfig = JSON.parse(content as string);
    });
    mockFs.mkdirpSync.mockImplementation();

    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue(tempDir);

    configService = new ConfigService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.chdir(originalCwd);
  });

  describe('Composition Rules', () => {
    test('should return empty array when no composition rules exist', () => {
      const rules = configService.getCompositionRules();
      expect(rules).toEqual([]);
    });

    test('should add composition rule', () => {
      const rule: CompositionRule = {
        name: 'base',
        path: './base.md',
        priority: 1,
        enabled: true,
      };

      configService.addCompositionRule(rule);

      const rules = configService.getCompositionRules();
      expect(rules).toHaveLength(1);
      expect(rules[0]).toEqual(rule);
    });

    test('should update existing composition rule', () => {
      const rule: CompositionRule = {
        name: 'base',
        path: './base.md',
        priority: 1,
        enabled: true,
      };

      configService.addCompositionRule(rule);

      const updatedRule: CompositionRule = {
        name: 'base',
        path: './updated-base.md',
        priority: 2,
        enabled: false,
      };

      configService.addCompositionRule(updatedRule);

      const rules = configService.getCompositionRules();
      expect(rules).toHaveLength(1);
      expect(rules[0]).toEqual(updatedRule);
    });

    test('should remove composition rule', () => {
      const rule: CompositionRule = {
        name: 'base',
        path: './base.md',
        priority: 1,
        enabled: true,
      };

      configService.addCompositionRule(rule);
      expect(configService.getCompositionRules()).toHaveLength(1);

      configService.removeCompositionRule('base');
      expect(configService.getCompositionRules()).toHaveLength(0);
    });

    test('should return enabled composition rules sorted by priority', () => {
      const rules: CompositionRule[] = [
        { name: 'react', path: './react.md', priority: 3, enabled: true },
        { name: 'base', path: './base.md', priority: 1, enabled: true },
        { name: 'disabled', path: './disabled.md', priority: 2, enabled: false },
        { name: 'typescript', path: './typescript.md', priority: 2, enabled: true },
      ];

      rules.forEach((rule) => configService.addCompositionRule(rule));

      const enabledRules = configService.getEnabledCompositionRules();

      expect(enabledRules).toHaveLength(3);
      expect(enabledRules[0].name).toBe('base'); // priority 1
      expect(enabledRules[1].name).toBe('typescript'); // priority 2
      expect(enabledRules[2].name).toBe('react'); // priority 3
    });

    test('should handle rules without priority (default to 0)', () => {
      const rules: CompositionRule[] = [
        { name: 'no-priority', path: './no-priority.md', enabled: true },
        { name: 'with-priority', path: './with-priority.md', priority: 1, enabled: true },
      ];

      rules.forEach((rule) => configService.addCompositionRule(rule));

      const enabledRules = configService.getEnabledCompositionRules();

      expect(enabledRules).toHaveLength(2);
      expect(enabledRules[0].name).toBe('no-priority'); // priority 0 (default)
      expect(enabledRules[1].name).toBe('with-priority'); // priority 1
    });
  });
});