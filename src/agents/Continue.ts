import { AgentInterface } from './AgentInterface';

export class Continue implements AgentInterface {
  name(): string {
    return 'Continue.dev';
  }

  shortcode(): string {
    return 'continue';
  }

  path(): string {
    return '.continue/config.json';
  }

  gitignorePath(): string {
    return '.continue/config.json';
  }
}