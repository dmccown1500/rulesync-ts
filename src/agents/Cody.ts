import { AgentInterface } from './AgentInterface';

export class Cody implements AgentInterface {
  name(): string {
    return 'Sourcegraph Cody';
  }

  shortcode(): string {
    return 'cody';
  }

  path(): string {
    return '.vscode/cody.json';
  }

  gitignorePath(): string {
    return '.vscode/cody.json';
  }
}