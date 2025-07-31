import { AgentInterface } from './AgentInterface';

export class Junie implements AgentInterface {
  name(): string {
    return 'Junie';
  }

  shortcode(): string {
    return 'junie';
  }

  path(): string {
    return '.junie/guidelines.md';
  }

  gitignorePath(): string {
    return '.junie/guidelines.md';
  }
}
