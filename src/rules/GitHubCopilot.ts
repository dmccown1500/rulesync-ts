import { RuleInterface } from './RuleInterface';

export class GitHubCopilot implements RuleInterface {
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
