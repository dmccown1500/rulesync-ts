import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import { ConfigService } from '../services/ConfigService';
import { RuleDiscoveryService } from '../services/RuleDiscoveryService';
import { AgentInterface } from '../types';

export class GitignoreCommand {
  private configService: ConfigService;
  private ruleDiscovery: RuleDiscoveryService;

  constructor() {
    this.configService = new ConfigService();
    this.ruleDiscovery = new RuleDiscoveryService();
  }

  execute(): number {
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    const rules = this.ruleDiscovery.getRules();
    const disabledRules = this.configService.getDisabledRules();

    const enabledRules = rules.filter((rule) => !disabledRules.includes(rule.shortcode()));

    if (enabledRules.length === 0) {
      console.log(
        chalk.yellow('No enabled rules found. Use "rulesync rules:list" to see available rules.')
      );
      return 0;
    }

    // Read existing .gitignore content
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }

    // Prepare the rulesync section
    const rulesyncSection = this.buildRulesyncSection(enabledRules);

    // Check if rulesync section already exists
    const rulesyncStartMarker = '# Rulesync - AI Assistant Rules';
    const rulesyncEndMarker = '# End Rulesync';

    if (gitignoreContent.includes(rulesyncStartMarker)) {
      // Replace existing section
      const startIndex = gitignoreContent.indexOf(rulesyncStartMarker);
      const endIndex = gitignoreContent.indexOf(rulesyncEndMarker);

      if (endIndex !== -1) {
        const beforeSection = gitignoreContent.substring(0, startIndex);
        const afterSection = gitignoreContent.substring(endIndex + rulesyncEndMarker.length);
        gitignoreContent = beforeSection + rulesyncSection + afterSection;
      } else {
        // End marker not found, append at the end
        gitignoreContent += '\n' + rulesyncSection;
      }
    } else {
      // Add new section
      if (gitignoreContent && !gitignoreContent.endsWith('\n')) {
        gitignoreContent += '\n';
      }
      gitignoreContent += '\n' + rulesyncSection;
    }

    // Write the updated .gitignore
    fs.writeFileSync(gitignorePath, gitignoreContent);

    console.log(
      chalk.green(`Updated .gitignore with ${enabledRules.length} AI assistant rule files.`)
    );
    console.log(chalk.blue('Added entries:'));

    enabledRules.forEach((rule) => {
      console.log(`  ${rule.gitignorePath()}`);
    });

    return 0;
  }

  private buildRulesyncSection(rules: AgentInterface[]): string {
    const lines = ['# Rulesync - AI Assistant Rules', '# Generated automatically by rulesync', ''];

    rules.forEach((rule) => {
      lines.push(rule.gitignorePath());
    });

    lines.push('');
    lines.push('# End Rulesync');
    lines.push('');

    return lines.join('\n');
  }
}
