import chalk from 'chalk';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export class TemplatesCommand {
  private templatesDir: string;

  constructor() {
    this.templatesDir = join(process.cwd(), 'templates');
  }

  execute(): number {
    try {
      console.log(chalk.blue('Available Templates:'));
      console.log('');

      const categories = this.getTemplateCategories();

      if (Object.keys(categories).length === 0) {
        console.log(chalk.yellow('No templates found. Make sure you have a templates/ directory.'));
        return 0;
      }

      Object.entries(categories).forEach(([category, templates]) => {
        console.log(chalk.cyan(`${category.charAt(0).toUpperCase() + category.slice(1)}:`));
        templates.forEach((template) => {
          const templatePath = `${category}/${template.replace('.md', '')}`;
          console.log(
            `  ${chalk.green('•')} ${chalk.white(templatePath)} ${chalk.gray('- ' + this.getTemplateDescription(category, template))}`
          );
        });
        console.log('');
      });

      console.log(chalk.blue('Usage:'));
      console.log(
        `  ${chalk.yellow('rulesync compose base/clean-code')}        Use a single template`
      );
      console.log(
        `  ${chalk.yellow('rulesync compose base/clean-code react')}  Combine multiple templates`
      );
      console.log(
        `  ${chalk.yellow('rulesync compose /path/to/custom.md')}     Use custom rule files`
      );
      console.log(
        `  ${chalk.yellow('rulesync compose')}                        Show interactive picker`
      );
      console.log('');
      console.log(chalk.gray('Note: compose works with templates, file paths, or URLs'));

      return 0;
    } catch (error) {
      console.error(chalk.red('Error reading templates directory:'), error);
      return 1;
    }
  }

  private getTemplateCategories(): Record<string, string[]> {
    const categories: Record<string, string[]> = {};

    try {
      const items = readdirSync(this.templatesDir);

      for (const item of items) {
        const itemPath = join(this.templatesDir, item);
        const isDirectory = statSync(itemPath).isDirectory();

        if (isDirectory) {
          const templates = readdirSync(itemPath)
            .filter((file) => file.endsWith('.md'))
            .sort();

          if (templates.length > 0) {
            categories[item] = templates;
          }
        }
      }
    } catch {
      // Directory doesn't exist or can't be read
    }

    return categories;
  }

  private getTemplateDescription(category: string, template: string): string {
    const descriptions: Record<string, Record<string, string>> = {
      base: {
        'clean-code.md': "Robert Martin's Clean Code principles",
      },
      language: {
        'typescript.md': 'TypeScript best practices and patterns',
        'python.md': 'Python coding standards and idioms',
        'nodejs.md': 'Node.js development guidelines',
        'golang.md': 'Go language conventions and practices',
      },
      framework: {
        'react.md': 'React component and hook patterns',
        'express.md': 'Express.js API development practices',
        'django.md': 'Django web framework conventions',
      },
    };

    return descriptions[category]?.[template] || 'Coding guidelines and best practices';
  }
}
