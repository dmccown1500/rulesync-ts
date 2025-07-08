import { RuleInterface } from './RuleInterface';

export class Gemini implements RuleInterface {
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
