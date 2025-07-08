import chalk from 'chalk';
import { ConfigService } from '../services/ConfigService';
import { RuleDiscoveryService } from '../services/RuleDiscoveryService';

export class EnableCommand {
  private configService: ConfigService;
  private ruleDiscovery: RuleDiscoveryService;

  constructor() {
    this.configService = new ConfigService();
    this.ruleDiscovery = new RuleDiscoveryService();
  }

  execute(ruleIdentifier: string): number {
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
      console.log('Use "rulesync rules:list" to see available rules.');
      return 1;
    }

    const disabledRules = this.configService.getDisabledRules();
    
    if (!disabledRules.includes(rule.shortcode())) {
      console.log(chalk.yellow(`Rule "${rule.name()}" is already enabled.`));
      return 0;
    }

    this.configService.enableRule(rule.shortcode());
    console.log(chalk.green(`Enabled rule: ${rule.name()} (${rule.shortcode()})`));

    return 0;
  }
}
