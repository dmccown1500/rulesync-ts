export interface RuleInterface {
  name(): string;
  shortcode(): string;
  path(): string;
  gitignorePath(): string;
}
