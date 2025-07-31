export interface ExclusionBlock {
  content: string;
  excludedAgents: string[];
  startIndex: number;
  endIndex: number;
}

export class ContentFilterService {
  private static readonly EXCLUDE_START_REGEX = /<!--\s*exclude:\s*([^>]+)\s*-->/i;
  private static readonly EXCLUDE_END_REGEX = /<!--\s*\/exclude\s*-->/i;

  /**
   * Filters content for a specific agent by removing excluded sections
   */
  filterContentForAgent(content: string, agentShortcode: string): string {
    const exclusionBlocks = this.parseExclusionBlocks(content);

    if (exclusionBlocks.length === 0) {
      return content;
    }

    // Sort blocks by start index in descending order to remove from end to start
    // This prevents index shifting issues when removing content
    const sortedBlocks = exclusionBlocks.sort((a, b) => b.startIndex - a.startIndex);

    let filteredContent = content;

    for (const block of sortedBlocks) {
      if (this.shouldExcludeForAgent(block.excludedAgents, agentShortcode)) {
        // Remove the entire block including the comment tags
        filteredContent =
          filteredContent.substring(0, block.startIndex) +
          filteredContent.substring(block.endIndex);
      } else {
        // Keep the content but remove the comment tags
        const contentOnly = block.content;
        filteredContent =
          filteredContent.substring(0, block.startIndex) +
          contentOnly +
          filteredContent.substring(block.endIndex);
      }
    }

    return this.cleanupContent(filteredContent);
  }

  /**
   * Parses the content to find all exclusion blocks
   */
  private parseExclusionBlocks(content: string): ExclusionBlock[] {
    const blocks: ExclusionBlock[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const startMatch = line.match(ContentFilterService.EXCLUDE_START_REGEX);

      if (startMatch) {
        const excludedAgents = this.parseAgentList(startMatch[1]);
        let blockContent = '';
        let endLineIndex = -1;

        // Find the matching end tag
        for (let j = i + 1; j < lines.length; j++) {
          const endLine = lines[j];

          if (endLine.match(ContentFilterService.EXCLUDE_END_REGEX)) {
            endLineIndex = j;
            break;
          }
        }

        if (endLineIndex === -1) {
          console.warn(
            `Warning: Found exclude start tag without matching end tag at line ${i + 1}`
          );
          continue;
        }

        // Extract content between start and end tags
        for (let k = i + 1; k < endLineIndex; k++) {
          blockContent += lines[k];
          if (k < endLineIndex - 1) blockContent += '\n';
        }

        // Calculate start and end positions in original content
        const startPos = this.getLinePosition(content, i);
        const endPos = this.getLinePosition(content, endLineIndex + 1); // Include the newline after end tag

        blocks.push({
          content: blockContent,
          excludedAgents,
          startIndex: startPos,
          endIndex: endPos,
        });

        i = endLineIndex; // Skip to after the end tag
      }
    }

    return blocks;
  }

  /**
   * Gets the character position of a line in the content
   */
  private getLinePosition(content: string, lineNumber: number): number {
    const lines = content.split('\n');
    let position = 0;

    for (let i = 0; i < lineNumber && i < lines.length; i++) {
      position += lines[i].length + 1; // +1 for newline
    }

    return position;
  }

  /**
   * Parses the comma-separated list of agent shortcodes
   */
  private parseAgentList(agentString: string): string[] {
    return agentString
      .split(',')
      .map((agent) => agent.trim().toLowerCase())
      .filter((agent) => agent.length > 0);
  }

  /**
   * Determines if content should be excluded for a specific agent
   */
  private shouldExcludeForAgent(excludedAgents: string[], agentShortcode: string): boolean {
    return excludedAgents.includes(agentShortcode.toLowerCase());
  }

  /**
   * Cleans up the filtered content by removing excessive blank lines
   */
  private cleanupContent(content: string): string {
    // Remove excessive blank lines (more than 2 consecutive)
    return content.replace(/\n{3,}/g, '\n\n').trim();
  }

  /**
   * Gets a list of all excluded agents mentioned in the content
   */
  getExcludedAgentsInContent(content: string): string[] {
    const blocks = this.parseExclusionBlocks(content);
    const allExcludedAgents = new Set<string>();

    blocks.forEach((block) => {
      block.excludedAgents.forEach((agent) => allExcludedAgents.add(agent));
    });

    return Array.from(allExcludedAgents).sort();
  }

  /**
   * Validates that all excluded agents are valid shortcodes
   */
  validateExcludedAgents(content: string, validShortcodes: string[]): string[] {
    const excludedAgents = this.getExcludedAgentsInContent(content);
    const validShortcodesLower = validShortcodes.map((s) => s.toLowerCase());

    return excludedAgents.filter((agent) => !validShortcodesLower.includes(agent));
  }
}
