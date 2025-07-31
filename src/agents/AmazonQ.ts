import { AgentInterface } from './AgentInterface';

export class AmazonQ implements AgentInterface {
  name(): string {
    return 'Amazon Q Developer';
  }

  shortcode(): string {
    return 'amazonq';
  }

  path(): string {
    return '.amazonq/rules/coding-guidelines.md';
  }

  gitignorePath(): string {
    return '.amazonq/rules/';
  }
}
