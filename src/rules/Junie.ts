import { RuleInterface } from './RuleInterface';

export class Junie implements RuleInterface {
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
