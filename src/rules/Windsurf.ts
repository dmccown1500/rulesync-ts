import { RuleInterface } from './RuleInterface';

export class Windsurf implements RuleInterface {
  name(): string {
    return 'Windsurf';
  }

  shortcode(): string {
    return 'windsurf';
  }

  path(): string {
    return '.windsurfrules';
  }

  gitignorePath(): string {
    return '.windsurfrules';
  }
}
