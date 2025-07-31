import { AgentInterface } from './AgentInterface';

export class OpenAICodex implements AgentInterface {
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
