import { RuleInterface } from './RuleInterface';

export class Claude implements RuleInterface {
  name(): string {
    return 'Claude';
  }

  shortcode(): string {
    return 'claude';
  }

  path(): string {
    return 'CLAUDE.md';
  }

  gitignorePath(): string {
    return 'CLAUDE.md';
  }
}
