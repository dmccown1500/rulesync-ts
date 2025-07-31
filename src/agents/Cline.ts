import { AgentInterface } from './AgentInterface';

export class Cline implements AgentInterface {
  name(): string {
    return 'Cline';
  }

  shortcode(): string {
    return 'cline';
  }

  path(): string {
    return '.clinerules/project.md';
  }

  gitignorePath(): string {
    return '.clinerules/project.md';
  }
}
