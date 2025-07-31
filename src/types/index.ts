export interface AgentInterface {
  name(): string;
  shortcode(): string;
  path(): string;
  gitignorePath(): string;
}

export interface Config {
  disabled_rules?: string[];
  base_rules_path?: string;
  augment?: boolean;
  composition_rules?: CompositionRule[];
}

export interface CompositionRule {
  name: string;
  path: string;
  priority?: number;
  enabled?: boolean;
}

export interface RuleFile {
  name: string;
  path: string;
  rule: AgentInterface;
}

export interface GenerateOptions {
  force?: boolean;
  overwrite?: boolean;
  from?: string;
}
