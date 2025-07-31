import chalk from 'chalk';
import { ConfigService } from '../services/ConfigService';
import { RuleDiscoveryService } from '../services/RuleDiscoveryService';

export class ListCommand {
  private configService: ConfigService;
  private ruleDiscovery: RuleDiscoveryService;

  constructor() {
    this.configService = new ConfigService();
    this.ruleDiscovery = new RuleDiscoveryService();
  }

  execute(): number {
    console.log(
      chalk.yellow(
        '⚠️  DEPRECATED: The "rules:list" command is deprecated and will be removed in a future version.'
      )
    );
    console.log(chalk.yellow('   Please use "agents" instead.'));
    console.log('');

    const rules = this.ruleDiscovery.getRules();
    const disabledRules = this.configService.getDisabledRules();

    console.log(chalk.blue('Available AI Assistants:'));
    console.log('');

    rules.forEach((rule, index) => {
      const isDisabled = disabledRules.includes(rule.shortcode());
      const status = isDisabled ? chalk.red('disabled') : chalk.green('enabled');
      const statusIcon = isDisabled ? '✗' : '✓';

      console.log(
        `${chalk.cyan(`[${index}]`)} ${rule.name()} → ${rule.path()} ${statusIcon} ${status}`
      );
    });

    console.log('');
    console.log(
      `Total: ${rules.length} assistants (${rules.length - disabledRules.length} enabled, ${disabledRules.length} disabled)`
    );

    return 0;
  }
}
