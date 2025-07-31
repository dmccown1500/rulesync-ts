import { AgentInterface } from './AgentInterface';

export class Claude implements AgentInterface {
  name(): string {
    return 'Claude';
  }

  shortcode(): string {
    return 'claude';
  }

  path(): string {
    return 'CLAUDE.md';
  }

  gitignorePath(): string {
    return 'CLAUDE.md';
  }
}
