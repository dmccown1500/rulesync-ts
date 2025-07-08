import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { Config } from '../types';

export class ConfigService {
  private configPath: string;
  private config: Config = {};

  constructor() {
    this.configPath = this.getConfigPath();
    this.ensureConfigDirectoryExists();
    this.loadConfig();
  }

  getConfigPath(): string {
    if (this.isLocalProject()) {
      return path.join(process.cwd(), '.rulesync', 'rulesync.json');
    }
    return path.join(os.homedir(), '.config', 'rulesync', 'rulesync.json');
  }

  getConfigDirectory(): string {
    return path.dirname(this.configPath);
  }

  getRulesDirectory(): string {
    return path.dirname(this.configPath);
  }

  isLocalProject(): boolean {
    return fs.existsSync(path.join(process.cwd(), 'package.json')) || 
           fs.existsSync(path.join(process.cwd(), 'composer.json'));
  }

  getDisabledRules(): string[] {
    return this.config.disabled_rules || [];
  }

  getBaseRulesPath(): string | undefined {
    return this.config.base_rules_path;
  }

  disableRule(shortcode: string): void {
    const disabled = this.getDisabledRules();
    if (!disabled.includes(shortcode)) {
      disabled.push(shortcode);
      this.config.disabled_rules = disabled;
      this.saveConfig();
    }
  }

  enableRule(shortcode: string): void {
    const disabled = this.getDisabledRules();
    this.config.disabled_rules = disabled.filter(rule => rule !== shortcode);
    this.saveConfig();
  }

  setBaseRulesPath(path: string | undefined): void {
    this.config.base_rules_path = path;
    this.saveConfig();
  }

  getConfig(): Config {
    return this.config;
  }

  getAugmentPreference(): boolean | undefined {
    return this.config.augment;
  }

  setAugmentPreference(augment: boolean): void {
    this.config.augment = augment;
    this.saveConfig();
  }

  private ensureConfigDirectoryExists(): void {
    const directory = path.dirname(this.configPath);
    if (!fs.existsSync(directory)) {
      fs.mkdirpSync(directory);
    }
  }

  private loadConfig(): void {
    if (fs.existsSync(this.configPath)) {
      try {
        const content = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(content);
      } catch (error) {
        this.config = {};
      }
    } else {
      this.config = {};
    }
  }

  private saveConfig(): void {
    fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }
}
