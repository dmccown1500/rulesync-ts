import { AgentInterface } from '../agents/AgentInterface';
import {
  Claude,
  Cursor,
  Windsurf,
  Gemini,
  GitHubCopilot,
  Cline,
  Junie,
  OpenAICodex,
  Aider,
  Continue,
  AmazonQ,
  Cody,
} from '../agents';

export class RuleDiscoveryService {
  private rules: AgentInterface[];

  constructor() {
    this.rules = [
      new Claude(),
      new Cursor(),
      new Windsurf(),
      new Gemini(),
      new GitHubCopilot(),
      new Cline(),
      new Junie(),
      new OpenAICodex(),
      new Aider(),
      new Continue(),
      new AmazonQ(),
      new Cody(),
    ];
  }

  getRules(): AgentInterface[] {
    return this.rules;
  }

  getRuleByShortcode(shortcode: string): AgentInterface | undefined {
    return this.rules.find((rule) => rule.shortcode() === shortcode);
  }
}
