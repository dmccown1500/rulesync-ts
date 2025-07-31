import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import axios from 'axios';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ConfigService } from '../services/ConfigService';
import { RuleDiscoveryService } from '../services/RuleDiscoveryService';
import { ContentFilterService } from '../services/ContentFilterService';
import { GenerateOptions, RuleFile, CompositionRule } from '../types';

export class GenerateCommand {
  private configService: ConfigService;
  private ruleDiscovery: RuleDiscoveryService;
  private contentFilter: ContentFilterService;

  constructor() {
    this.configService = new ConfigService();
    this.ruleDiscovery = new RuleDiscoveryService();
    this.contentFilter = new ContentFilterService();
  }

  async execute(options: GenerateOptions = {}): Promise<number> {
    if (!options.force && !(await this.checkVcsAndConfirm())) {
      return 1;
    }

    const composedContent = await this.getComposedContent(options);
    if (!composedContent) {
      return 1;
    }

    const baseRules = await this.getBaseRules();
    const rules = this.ruleDiscovery.getRules();
    const disabledRules = this.configService.getDisabledRules();

    const enabledRules = rules.filter((rule) => !disabledRules.includes(rule.shortcode()));

    if (enabledRules.length === 0) {
      console.log(
        chalk.yellow('No enabled rules found. Use "rulesync rules:list" to see available rules.')
      );
      return 0;
    }

    console.log(chalk.blue('Generating rule files...'));
    console.log('');

    let generated = 0;
    let skipped = 0;

    // Validate excluded agents before processing
    const allRules = this.ruleDiscovery.getRules();
    const validShortcodes = allRules.map((rule) => rule.shortcode());
    const invalidAgents = this.contentFilter.validateExcludedAgents(
      composedContent,
      validShortcodes
    );

    if (invalidAgents.length > 0) {
      console.warn(
        chalk.yellow(
          `Warning: Unknown agent shortcodes in exclusion comments: ${invalidAgents.join(', ')}`
        )
      );
      console.log(`Valid shortcodes: ${validShortcodes.join(', ')}`);
    }

    for (const rule of enabledRules) {
      const targetPath = rule.path();
      const targetDir = path.dirname(targetPath);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirpSync(targetDir);
      }

      // Filter content for this specific agent
      const baseContent = this.buildFinalContent(composedContent, baseRules);
      const filteredContent = this.contentFilter.filterContentForAgent(
        baseContent,
        rule.shortcode()
      );

      if (await this.shouldWriteFile(targetPath, filteredContent, options)) {
        fs.writeFileSync(targetPath, filteredContent);
        console.log(`${chalk.green('Generated:')} ${targetPath}`);
        generated++;
      } else {
        console.log(`${chalk.yellow('Skipped:')} ${targetPath}`);
        skipped++;
      }
    }

    console.log('');
    console.log(
      chalk.blue(`Generation complete: ${generated} files generated, ${skipped} skipped.`)
    );

    return 0;
  }

  private async getSourceFile(options: GenerateOptions): Promise<string | null> {
    if (options.from) {
      if (!fs.existsSync(options.from)) {
        console.error(chalk.red(`Custom source file not found: ${options.from}`));
        return null;
      }
      return options.from;
    }

    const localRulesFile = path.join(process.cwd(), 'rulesync.md');
    const globalRulesFile = path.join(os.homedir(), '.config', 'rulesync', 'rulesync.md');

    const localExists = fs.existsSync(localRulesFile);
    const globalExists = fs.existsSync(globalRulesFile);

    // If both local and global files exist, handle augmentation
    if (localExists && globalExists && localRulesFile !== globalRulesFile) {
      return await this.handleAugmentation(localRulesFile, globalRulesFile);
    }

    // Original logic - prefer local over global
    if (localExists) {
      return localRulesFile;
    }

    if (globalExists) {
      return globalRulesFile;
    }

    return await this.handleMissingSourceFile();
  }

  private async getSourceContent(sourceFile: string): Promise<string | null> {
    try {
      const content = fs.readFileSync(sourceFile, 'utf8');
      if (!content.trim()) {
        console.error(chalk.red(`Source file is empty: ${sourceFile}`));
        return null;
      }
      return content;
    } catch (error) {
      console.error(chalk.red(`Failed to read source file: ${error}`));
      return null;
    }
  }

  private async getBaseRules(): Promise<string | null> {
    const baseRulesPath = this.configService.getBaseRulesPath();
    if (!baseRulesPath) {
      return null;
    }

    try {
      if (this.isUrl(baseRulesPath)) {
        const response = await axios.get(baseRulesPath, { timeout: 10000 });
        return response.data;
      } else {
        if (!fs.existsSync(baseRulesPath)) {
          console.warn(chalk.yellow(`Base rules file not found: ${baseRulesPath}`));
          return null;
        }
        return fs.readFileSync(baseRulesPath, 'utf8');
      }
    } catch (error) {
      console.warn(chalk.yellow(`Failed to load base rules: ${error}`));
      return null;
    }
  }

  private buildFinalContent(sourceContent: string, baseRules: string | null): string {
    let content = sourceContent;
    if (baseRules && baseRules.trim()) {
      content += '\n\n' + baseRules;
    }
    return content;
  }

  private async shouldWriteFile(
    targetPath: string,
    content: string,
    options: GenerateOptions
  ): Promise<boolean> {
    if (!fs.existsSync(targetPath)) {
      return true;
    }

    if (options.overwrite || options.force) {
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

  private isUrl(path: string): boolean {
    try {
      new URL(path);
      return true;
    } catch {
      return false;
    }
  }

  private async checkVcsAndConfirm(): Promise<boolean> {
    if (this.isUnderVersionControl()) {
      return true;
    }

    console.warn(chalk.yellow('Warning: You are not in a version-controlled directory.'));
    console.log('Generating rule files without version control may result in lost changes.');
    console.log(`Consider initializing git with: ${chalk.cyan('git init')}`);
    console.log('');

    const { continue: shouldContinue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Do you want to continue anyway?',
        default: false,
      },
    ]);

    return shouldContinue;
  }

  private isUnderVersionControl(): boolean {
    return fs.existsSync(path.join(process.cwd(), '.git'));
  }

  private async handleMissingSourceFile(): Promise<string | null> {
    console.error(chalk.red('No source file found.'));

    const existingRuleFiles = this.findExistingRuleFiles();

    if (existingRuleFiles.length > 0) {
      console.log('');
      console.log('Found existing rule files that could be used as templates:');

      existingRuleFiles.forEach((ruleFile, index) => {
        console.log(`  ${chalk.cyan(`[${index}]`)} ${ruleFile.path} (${ruleFile.name})`);
      });

      console.log('');

      const { useTemplate } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useTemplate',
          message: 'Would you like to use one of these as a template for rulesync.md?',
          default: false,
        },
      ]);

      if (useTemplate) {
        const { choice } = await inquirer.prompt([
          {
            type: 'input',
            name: 'choice',
            message: 'Enter the number of the file to use as template:',
          },
        ]);

        const choiceIndex = parseInt(choice);
        if (existingRuleFiles[choiceIndex]) {
          return await this.createRulesyncFromTemplate(existingRuleFiles[choiceIndex]);
        } else {
          console.error(chalk.red(`Invalid choice: ${choice}`));
        }
      }
    }

    console.log('');
    console.log('You must create a rulesync.md file or use the --from option.');

    if (this.configService.isLocalProject()) {
      console.log(`For local projects, create: ${chalk.cyan('rulesync.md')}`);
    } else {
      console.log(`For global usage, create: ${chalk.cyan('~/.config/rulesync/rulesync.md')}`);
    }

    return null;
  }

  private findExistingRuleFiles(): RuleFile[] {
    const ruleFiles: RuleFile[] = [];
    const rules = this.ruleDiscovery.getRules();

    rules.forEach((rule) => {
      const rulePath = rule.path();
      if (fs.existsSync(rulePath)) {
        const content = fs.readFileSync(rulePath, 'utf8');
        if (content.trim()) {
          ruleFiles.push({
            name: rule.name(),
            path: rulePath,
            rule: rule,
          });
        }
      }
    });

    return ruleFiles;
  }

  private async handleAugmentation(localFile: string, globalFile: string): Promise<string> {
    const augmentPreference = this.configService.getAugmentPreference();

    let shouldAugment: boolean;

    if (augmentPreference === undefined) {
      console.log('');
      console.log(chalk.blue('Found both local and global rulesync.md files:'));
      console.log(`  Local:  ${localFile}`);
      console.log(`  Global: ${globalFile}`);
      console.log('');

      const { augment } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'augment',
          message: 'Would you like to combine both files? (Local rules first, then global rules)',
          default: true,
        },
      ]);

      shouldAugment = augment;

      const { savePreference } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'savePreference',
          message: `Save this preference ${shouldAugment ? '(combine files)' : '(use local only)'} for future generate calls in this directory?`,
          default: false,
        },
      ]);

      if (savePreference) {
        this.configService.setAugmentPreference(shouldAugment);
      }
    } else {
      shouldAugment = augmentPreference;
    }

    if (shouldAugment) {
      return this.createAugmentedFile(localFile, globalFile);
    }

    return localFile; // Use local file only
  }

  private createAugmentedFile(localFile: string, globalFile: string): string {
    const localContent = fs.readFileSync(localFile, 'utf8');
    const globalContent = fs.readFileSync(globalFile, 'utf8');

    const augmentedContent = `# Project-specific rules\n\n${localContent}\n\n---\n\n# General rules\n\n${globalContent}`;

    const tempFile = path.join(os.tmpdir(), `rulesync_augmented_${Date.now()}.md`);
    fs.writeFileSync(tempFile, augmentedContent);

    console.log(chalk.blue('Using augmented rules (local + global)'));

    return tempFile;
  }

  private async createRulesyncFromTemplate(templateFile: RuleFile): Promise<string> {
    const templateContent = fs.readFileSync(templateFile.path, 'utf8');

    const rulesyncPath = this.configService.isLocalProject()
      ? path.join(process.cwd(), 'rulesync.md')
      : path.join(this.configService.getRulesDirectory(), 'rulesync.md');

    fs.writeFileSync(rulesyncPath, templateContent);

    console.log(
      chalk.blue(`Created rulesync.md using ${templateFile.name} as template: ${rulesyncPath}`)
    );

    return rulesyncPath;
  }

  private async getComposedContent(options: GenerateOptions): Promise<string | null> {
    const mainSourceFile = await this.getSourceFile(options);
    if (!mainSourceFile) {
      return null;
    }

    const mainContent = await this.getSourceContent(mainSourceFile);
    if (!mainContent) {
      return null;
    }

    const compositionRules = this.configService.getEnabledCompositionRules();

    if (compositionRules.length === 0) {
      return mainContent;
    }

    // Build content in logical order: composition rules first (base → tech-stack), then project rules
    const contentParts: string[] = [];

    // Add composition rules in priority order (base → tech-stack)
    for (const rule of compositionRules) {
      const content = await this.getCompositionRuleContent(rule);
      if (content) {
        contentParts.push(content);
      }
    }

    // Add main project content last (most specific)
    contentParts.push(mainContent);

    if (contentParts.length === 1) {
      return mainContent;
    }

    console.log(
      chalk.blue(
        `Composing rules from ${contentParts.length} sources (base → tech-stack → project)...`
      )
    );
    return contentParts.join('\n\n---\n\n');
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
}
