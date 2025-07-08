import { RuleInterface } from './RuleInterface';

export class Cursor implements RuleInterface {
  name(): string {
    return 'Cursor';
  }

  shortcode(): string {
    return 'cursor';
  }

  path(): string {
    return '.cursorrules';
  }

  gitignorePath(): string {
    return '.cursorrules';
  }
}
