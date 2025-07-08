import { RuleInterface } from './RuleInterface';

export class Cline implements RuleInterface {
  name(): string {
    return 'Cline';
  }

  shortcode(): string {
    return 'cline';
  }

  path(): string {
    return '.clinerules/project.md';
  }

  gitignorePath(): string {
    return '.clinerules/project.md';
  }
}
