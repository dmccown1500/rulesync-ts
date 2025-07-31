import { AgentInterface } from './AgentInterface';

export class Windsurf implements AgentInterface {
  name(): string {
    return 'Windsurf';
  }

  shortcode(): string {
    return 'windsurf';
  }

  path(): string {
    return '.windsurfrules';
  }

  gitignorePath(): string {
    return '.windsurfrules';
  }
}
