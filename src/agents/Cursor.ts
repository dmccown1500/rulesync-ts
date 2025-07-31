import { AgentInterface } from './AgentInterface';

export class Cursor implements AgentInterface {
  name(): string {
    return 'Cursor';
  }

  shortcode(): string {
    return 'cursor';
  }

  path(): string {
    return '.cursorrules';
  }

  gitignorePath(): string {
    return '.cursorrules';
  }
}
