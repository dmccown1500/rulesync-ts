import { RuleInterface } from './RuleInterface';

export class OpenAICodex implements RuleInterface {
  name(): string {
    return 'OpenAI Codex';
  }

  shortcode(): string {
    return 'codex';
  }

  path(): string {
    return 'AGENTS.md';
  }

  gitignorePath(): string {
    return 'AGENTS.md';
  }
}
