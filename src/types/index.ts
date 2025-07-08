export interface RuleInterface {
  name(): string;
  shortcode(): string;
  path(): string;
  gitignorePath(): string;
}

export interface Config {
  disabled_rules?: string[];
  base_rules_path?: string;
  augment?: boolean;
}

export interface RuleFile {
  name: string;
  path: string;
  rule: RuleInterface;
}

export interface GenerateOptions {
  force?: boolean;
  overwrite?: boolean;
  from?: string;
}
