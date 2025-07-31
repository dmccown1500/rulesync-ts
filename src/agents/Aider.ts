import { AgentInterface } from './AgentInterface';

export class Aider implements AgentInterface {
  name(): string {
    return 'Aider';
  }

  shortcode(): string {
    return 'aider';
  }

  path(): string {
    return '.aider.conf.yml';
  }

  gitignorePath(): string {
    return '.aider.conf.yml';
  }
}