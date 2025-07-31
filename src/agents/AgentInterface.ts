export interface AgentInterface {
  name(): string;
  shortcode(): string;
  path(): string;
  gitignorePath(): string;
}
