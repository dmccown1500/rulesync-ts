import { RuleInterface } from '../rules/RuleInterface';
import { 
  Claude, 
  Cursor, 
  Windsurf, 
  Gemini, 
  GitHubCopilot, 
  Cline, 
  Junie, 
  OpenAICodex 
} from '../rules';

export class RuleDiscoveryService {
  private rules: RuleInterface[];

  constructor() {
    this.rules = [
      new Claude(),
      new Cursor(),
      new Windsurf(),
      new Gemini(),
      new GitHubCopilot(),
      new Cline(),
      new Junie(),
      new OpenAICodex()
    ];
  }

  getRules(): RuleInterface[] {
    return this.rules;
  }

  getRuleByShortcode(shortcode: string): RuleInterface | undefined {
    return this.rules.find(rule => rule.shortcode() === shortcode);
  }
}
