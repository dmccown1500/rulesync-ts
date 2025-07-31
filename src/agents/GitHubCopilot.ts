import { AgentInterface } from './AgentInterface';

export class GitHubCopilot implements AgentInterface {
  name(): string {
    return 'GitHub Copilot';
  }

  shortcode(): string {
    return 'copilot';
  }

  path(): string {
    return '.github/copilot-instructions.md';
  }

  gitignorePath(): string {
    return '.github/copilot-instructions.md';
  }
}
