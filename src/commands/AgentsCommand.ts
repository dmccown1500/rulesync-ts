import chalk from 'chalk';
import { ConfigService } from '../services/ConfigService';
import { RuleDiscoveryService } from '../services/RuleDiscoveryService';
import { EnableCommand } from './EnableCommand';
import { DisableCommand } from './DisableCommand';

export class AgentsCommand {
  private configService: ConfigService;
  private ruleDiscovery: RuleDiscoveryService;

  constructor() {
    this.configService = new ConfigService();
    this.ruleDiscovery = new RuleDiscoveryService();
  }

  execute(): number {
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

  executeEnable(ruleIdentifier: string): number {
    const enableCommand = new EnableCommand();
    return enableCommand.execute(ruleIdentifier, false); // Don't show deprecation warning
  }

  executeDisable(ruleIdentifier: string): number {
    const disableCommand = new DisableCommand();
    return disableCommand.execute(ruleIdentifier, false); // Don't show deprecation warning
  }
}
