import chalk from 'chalk';
import { ConfigService } from '../services/ConfigService';

export class ConfigCommand {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  execute(): number {
    const config = this.configService.getConfig();
    const configPath = this.configService.getConfigPath();

    console.log(chalk.blue('Current Configuration:'));
    console.log('');
    console.log(`${chalk.cyan('Config file:')} ${configPath}`);
    console.log(
      `${chalk.cyan('Project type:')} ${this.configService.isLocalProject() ? 'Local' : 'Global'}`
    );
    console.log('');

    if (config.disabled_rules && config.disabled_rules.length > 0) {
      console.log(`${chalk.cyan('Disabled agents:')} ${config.disabled_rules.join(', ')}`);
    } else {
      console.log(`${chalk.cyan('Disabled agents:')} None`);
    }

    if (config.base_rules_path) {
      console.log(`${chalk.cyan('Base rules path:')} ${config.base_rules_path}`);
    } else {
      console.log(`${chalk.cyan('Base rules path:')} Not set`);
    }

    if (config.augment !== undefined) {
      console.log(
        `${chalk.cyan('Augment preference:')} ${config.augment ? 'Combine local and global' : 'Use local only'}`
      );
    } else {
      console.log(`${chalk.cyan('Augment preference:')} Not set (will prompt)`);
    }

    return 0;
  }
}
