import { AgentInterface } from './AgentInterface';

export class Gemini implements AgentInterface {
  name(): string {
    return 'Gemini CLI';
  }

  shortcode(): string {
    return 'gemini';
  }

  path(): string {
    return 'GEMINI.md';
  }

  gitignorePath(): string {
    return 'GEMINI.md';
  }
}
