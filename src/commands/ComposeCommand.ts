import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';
import { ConfigService } from '../services/ConfigService';
import type { CompositionRule } from '../types';

export class ComposeCommand {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  async execute(ruleIdentifiers: string[], options: { force?: boolean } = {}): Promise<number> {
    if (ruleIdentifiers.length === 0) {
      console.error(chalk.red('No rule identifiers provided'));
      console.log('Usage: rulesync compose <rule1> <rule2> ...');
      console.log('');
      console.log('Examples:');
      console.log(`  ${chalk.cyan('rulesync compose base clean-code react typescript')}`);
      console.log(
        `  ${chalk.cyan('rulesync compose ./my-base.md ./templates/react-typescript.md')}`
      );
      console.log(`  ${chalk.cyan('rulesync compose base clean-code ./custom-rules.md')}`);
      return 1;
    }

    console.log(chalk.blue('Setting up rule composition...'));
    console.log('');

    // Clear existing composition rules
    const existingRules = this.configService.getCompositionRules();
    for (const rule of existingRules) {
      this.configService.removeCompositionRule(rule.name);
    }

    // Resolve and add new composition rules
    const resolvedRules: CompositionRule[] = [];

    for (let i = 0; i < ruleIdentifiers.length; i++) {
      const identifier = ruleIdentifiers[i];
      const resolvedRule = await this.resolveRuleIdentifier(identifier, i + 1);

      if (resolvedRule) {
        resolvedRules.push(resolvedRule);
      } else {
        console.error(chalk.red(`Failed to resolve rule: ${identifier}`));
        return 1;
      }
    }

    // Add all resolved rules to configuration
    for (const rule of resolvedRules) {
      this.configService.addCompositionRule(rule);
      console.log(
        `${chalk.green('Added:')} ${rule.name} (${rule.path}) - priority ${rule.priority}`
      );
    }

    console.log('');
    console.log(chalk.blue(`Composition setup complete with ${resolvedRules.length} rules`));
    console.log('');

    // Generate rulesync.md file with composed content
    console.log(chalk.blue('Generating rulesync.md with composed rules...'));
    return await this.generateRulesyncFile({ force: options.force });
  }

  private async resolveRuleIdentifier(
    identifier: string,
    priority: number
  ): Promise<CompositionRule | null> {
    // Check if it's an absolute path or ends with .md (external file)
    if (path.isAbsolute(identifier) || identifier.endsWith('.md')) {
      return this.resolveFilePath(identifier, priority);
    }

    // Try to find matching file in templates directory (including folder paths like "base/clean-code")
    const templatesDir = path.join(__dirname, '..', '..', 'templates');
    const possibleFiles = await this.findMatchingTemplateFiles(identifier, templatesDir);

    if (possibleFiles.length === 1) {
      return this.createCompositionRule(possibleFiles[0], identifier, priority);
    } else if (possibleFiles.length === 0) {
      // Try as a relative file path fallback
      return this.resolveFilePath(identifier, priority);
    } else {
      // Multiple matches - show options
      console.error(chalk.yellow(`Multiple matches found for "${identifier}":`));
      possibleFiles.forEach((file, index) => {
        console.log(`  ${chalk.cyan(`[${index}]`)} ${file}`);
      });
      console.error(chalk.red('Please be more specific or use the full file path'));
      return null;
    }
  }

  private async resolveFilePath(
    filePath: string,
    priority: number
  ): Promise<CompositionRule | null> {
    let resolvedPath: string;

    if (path.isAbsolute(filePath)) {
      resolvedPath = filePath;
    } else {
      resolvedPath = path.resolve(process.cwd(), filePath);
    }

    if (!fs.existsSync(resolvedPath)) {
      console.error(chalk.red(`File not found: ${resolvedPath}`));
      return null;
    }

    const name = path.basename(filePath, path.extname(filePath));
    return this.createCompositionRule(resolvedPath, name, priority);
  }

  private async findMatchingTemplateFiles(
    identifier: string,
    templatesDir: string
  ): Promise<string[]> {
    if (!fs.existsSync(templatesDir)) {
      return [];
    }

    // Check if identifier includes folder path (e.g., "base/clean-code")
    if (identifier.includes('/')) {
      const filePath = path.join(templatesDir, `${identifier}.md`);
      if (fs.existsSync(filePath)) {
        return [filePath];
      }
      return [];
    }

    // Search recursively through all folders
    const allFiles = await this.getAllMarkdownFiles(templatesDir);

    // Try exact matches first (filename without extension)
    const exactMatches = allFiles.filter((filePath) => {
      const baseName = path.basename(filePath, '.md');
      return baseName === identifier || baseName.includes(identifier);
    });

    if (exactMatches.length > 0) {
      return exactMatches;
    }

    // Try partial matches
    const partialMatches = allFiles.filter((filePath) => {
      const baseName = path.basename(filePath, '.md').toLowerCase();
      const searchTerm = identifier.toLowerCase();
      return baseName.includes(searchTerm) || searchTerm.includes(baseName);
    });

    return partialMatches;
  }

  private async getAllMarkdownFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively search subdirectories
          const subDirFiles = await this.getAllMarkdownFiles(fullPath);
          files.push(...subDirFiles);
        } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignore errors for directories that don't exist or can't be read
    }

    return files;
  }

  private createCompositionRule(filePath: string, name: string, priority: number): CompositionRule {
    return {
      name,
      path: filePath,
      priority,
      enabled: true,
    };
  }

  async listAvailableTemplates(): Promise<number> {
    const templatesDir = path.join(__dirname, '..', '..', 'templates');

    if (!fs.existsSync(templatesDir)) {
      console.log(chalk.yellow('No templates directory found'));
      return 0;
    }

    console.log(chalk.blue('Available templates:'));
    console.log('');

    // List files organized by folder
    const folders = ['base', 'language', 'framework'];

    for (const folder of folders) {
      const folderPath = path.join(templatesDir, folder);
      if (!fs.existsSync(folderPath)) continue;

      const files = await fs.readdir(folderPath);
      const mdFiles = files.filter((file) => file.endsWith('.md') && file !== 'README.md');

      if (mdFiles.length === 0) continue;

      console.log(chalk.magenta(`${folder}/`));

      for (const file of mdFiles) {
        const baseName = path.basename(file, '.md');
        const filePath = path.join(folderPath, file);
        const relativePath = `${folder}/${baseName}`;

        // Try to read the first line as a title
        try {
          const content = await fs.readFile(filePath, 'utf8');
          const firstLine = content.split('\n')[0];
          const title = firstLine.startsWith('# ') ? firstLine.substring(2) : baseName;

          console.log(`  ${chalk.cyan(relativePath.padEnd(25))} ${title}`);
        } catch {
          console.log(`  ${chalk.cyan(relativePath)}`);
        }
      }
      console.log('');
    }

    console.log('Usage examples:');
    console.log(`  ${chalk.green('rulesync compose base/clean-code')}`);
    console.log(`  ${chalk.green('rulesync compose language/golang')}`);
    console.log(`  ${chalk.green('rulesync compose base/clean-code language/typescript')}`);
    console.log(`  ${chalk.green('rulesync compose ./custom-rules.md framework/react')}`);
    console.log('');
    console.log(chalk.gray('Note: You can mix templates, file paths, and URLs'));
    console.log('');
    console.log(chalk.blue('Workflow:'));
    console.log(
      `  ${chalk.cyan('1. rulesync compose')} - Creates rulesync.md from multiple sources`
    );
    console.log(
      `  ${chalk.cyan('2. rulesync generate')} - Creates agent-specific rule files from rulesync.md`
    );

    return 0;
  }

  private async generateRulesyncFile(options: { force?: boolean } = {}): Promise<number> {
    const compositionRules = this.configService.getEnabledCompositionRules();

    if (compositionRules.length === 0) {
      console.error(chalk.red('No composition rules configured'));
      return 1;
    }

    // Build content from composition rules only (no project rulesync.md)
    const contentParts: string[] = [];

    for (const rule of compositionRules) {
      const content = await this.getCompositionRuleContent(rule);
      if (content) {
        contentParts.push(content);
      }
    }

    if (contentParts.length === 0) {
      console.error(chalk.red('No valid composition rule content found'));
      return 1;
    }

    const composedContent = contentParts.join('\n\n---\n\n');
    const rulesyncPath = path.join(process.cwd(), 'rulesync.md');

    // Check if rulesync.md already exists and handle overwrite
    if (await this.shouldWriteFile(rulesyncPath, composedContent, options)) {
      fs.writeFileSync(rulesyncPath, composedContent);
      console.log(`${chalk.green('Generated:')} ${rulesyncPath}`);
      console.log('');
      console.log(
        chalk.blue(
          'Composition complete! You can now run "rulesync generate" to create agent-specific rule files.'
        )
      );
      return 0;
    } else {
      console.log(`${chalk.yellow('Skipped:')} ${rulesyncPath}`);
      return 1;
    }
  }

  private async getCompositionRuleContent(rule: CompositionRule): Promise<string | null> {
    try {
      const resolvedPath = this.resolveCompositionRulePath(rule.path);

      if (this.isUrl(resolvedPath)) {
        const response = await axios.get(resolvedPath, { timeout: 10000 });
        console.log(`${chalk.blue('Loaded:')} ${rule.name} (${resolvedPath})`);
        return response.data;
      } else {
        if (!fs.existsSync(resolvedPath)) {
          console.warn(
            chalk.yellow(`Composition rule file not found: ${rule.name} (${resolvedPath})`)
          );
          return null;
        }
        const content = fs.readFileSync(resolvedPath, 'utf8');
        console.log(`${chalk.blue('Loaded:')} ${rule.name} (${resolvedPath})`);
        return content;
      }
    } catch (error) {
      console.warn(chalk.yellow(`Failed to load composition rule ${rule.name}: ${error}`));
      return null;
    }
  }

  private resolveCompositionRulePath(rulePath: string): string {
    if (this.isUrl(rulePath)) {
      return rulePath;
    }

    if (path.isAbsolute(rulePath)) {
      return rulePath;
    }

    return path.resolve(process.cwd(), rulePath);
  }

  private isUrl(path: string): boolean {
    try {
      new URL(path);
      return true;
    } catch {
      return false;
    }
  }

  private async shouldWriteFile(
    targetPath: string,
    content: string,
    options: { force?: boolean }
  ): Promise<boolean> {
    if (!fs.existsSync(targetPath)) {
      return true;
    }

    if (options.force) {
      return true;
    }

    const existingContent = fs.readFileSync(targetPath, 'utf8');
    if (existingContent === content) {
      return true;
    }

    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `File exists and is different: ${targetPath}. Overwrite?`,
        default: false,
      },
    ]);

    return overwrite;
  }
}
