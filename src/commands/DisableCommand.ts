import chalk from 'chalk';
import { ConfigService } from '../services/ConfigService';
import { RuleDiscoveryService } from '../services/RuleDiscoveryService';

export class DisableCommand {
  private configService: ConfigService;
  private ruleDiscovery: RuleDiscoveryService;

  constructor() {
    this.configService = new ConfigService();
    this.ruleDiscovery = new RuleDiscoveryService();
  }

  execute(ruleIdentifier: string, showDeprecationWarning: boolean = true): number {
    if (showDeprecationWarning) {
      console.log(
        chalk.yellow(
          '⚠️  DEPRECATED: The "disable" command is deprecated and will be removed in a future version.'
        )
      );
      console.log(chalk.yellow('   Please use "agents disable" instead.'));
      console.log('');
    }

    const rules = this.ruleDiscovery.getRules();

    // Try to find rule by index or shortcode
    let rule;
    const ruleIndex = parseInt(ruleIdentifier);

    if (!isNaN(ruleIndex) && ruleIndex >= 0 && ruleIndex < rules.length) {
      rule = rules[ruleIndex];
    } else {
      rule = this.ruleDiscovery.getRuleByShortcode(ruleIdentifier);
    }

    if (!rule) {
      console.error(chalk.red(`Rule not found: ${ruleIdentifier}`));
      console.log('Use "rulesync agents" to see available agents.');
      return 1;
    }

    const disabledRules = this.configService.getDisabledRules();

    if (disabledRules.includes(rule.shortcode())) {
      console.log(chalk.yellow(`Rule "${rule.name()}" is already disabled.`));
      return 0;
    }

    this.configService.disableRule(rule.shortcode());
    console.log(chalk.green(`Disabled rule: ${rule.name()} (${rule.shortcode()})`));

    return 0;
  }
}
