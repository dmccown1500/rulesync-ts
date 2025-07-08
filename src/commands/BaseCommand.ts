import chalk from 'chalk';
import * as fs from 'fs-extra';
import { ConfigService } from '../services/ConfigService';

export class BaseCommand {
  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
  }

  execute(path?: string): number {
    if (!path) {
      // Show current base rules path
      const currentPath = this.configService.getBaseRulesPath();
      if (currentPath) {
        console.log(chalk.blue(`Current base rules path: ${currentPath}`));
      } else {
        console.log(chalk.yellow('No base rules path set.'));
      }
      return 0;
    }

    // Validate the path if it's a file path (not URL)
    if (!this.isUrl(path) && !fs.existsSync(path)) {
      console.error(chalk.red(`Base rules file not found: ${path}`));
      return 1;
    }

    this.configService.setBaseRulesPath(path);
    console.log(chalk.green(`Set base rules path to: ${path}`));

    return 0;
  }

  private isUrl(path: string): boolean {
    try {
      new URL(path);
      return true;
    } catch {
      return false;
    }
  }
}
