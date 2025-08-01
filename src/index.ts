#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  GenerateCommand,
  ListCommand,
  AgentsCommand,
  TemplatesCommand,
  ConfigCommand,
  EnableCommand,
  DisableCommand,
  BaseCommand,
  GitignoreCommand,
  ComposeCommand
} from './commands';

// Read version from package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const program = new Command();

program
  .name('rulesync')
  .description(chalk.cyan('Sync AI assistant rules across 12 AI assistants including Claude, Cursor, Windsurf, GitHub Copilot, and more'))
  .version(packageJson.version);

// Generate command
program
  .command('generate')
  .description(chalk.green('Create rule files for all AI assistants from rulesync.md'))
  .option('--force', 'Skip confirmation prompts')
  .option('--overwrite', 'Replace existing files')
  .option('--from <path>', 'Use custom source file instead of rulesync.md')
  .action(async (options) => {
    const command = new GenerateCommand();
    const exitCode = await command.execute(options);
    process.exit(exitCode);
  });

// Agents command with subcommands
const agentsProgram = program
  .command('agents')
  .description(chalk.blue('List and manage AI assistants'));

agentsProgram
  .command('list')
  .description(chalk.white('Show all AI assistants with their status'))
  .action(() => {
    const command = new AgentsCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

agentsProgram
  .command('enable <agent>')
  .description(chalk.green('Enable rule generation for an AI assistant'))
  .action((agent) => {
    const command = new AgentsCommand();
    const exitCode = command.executeEnable(agent);
    process.exit(exitCode);
  });

agentsProgram
  .command('disable <agent>')
  .description(chalk.red('Disable rule generation for an AI assistant'))
  .action((agent) => {
    const command = new AgentsCommand();
    const exitCode = command.executeDisable(agent);
    process.exit(exitCode);
  });

// Default action for agents (show list)
agentsProgram.action(() => {
  const command = new AgentsCommand();
  const exitCode = command.execute();
  process.exit(exitCode);
});

// Templates command
program
  .command('templates')
  .description(chalk.magenta('List all available rule templates'))
  .action(() => {
    const command = new TemplatesCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// Compose command (streamlined workflow)
program
  .command('compose [rules...]')
  .description(chalk.blue('Compose rules from multiple sources into rulesync.md'))
  .option('--force', 'Skip confirmation prompts')
  .action(async (rules, options) => {
    if (!rules || rules.length === 0) {
      const command = new ComposeCommand();
      const exitCode = await command.listAvailableTemplates();
      process.exit(exitCode);
    } else {
      const command = new ComposeCommand();
      const exitCode = await command.execute(rules, options);
      process.exit(exitCode);
    }
  });

// Gitignore command
program
  .command('gitignore')
  .description(chalk.cyan('Add AI assistant files to .gitignore'))
  .action(() => {
    const command = new GitignoreCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// Base command
program
  .command('base [path]')
  .description(chalk.yellow('Set persistent base rules for all generations'))
  .action((path) => {
    const command = new BaseCommand();
    const exitCode = command.execute(path);
    process.exit(exitCode);
  });

// Config command
program
  .command('config')
  .description(chalk.magenta('Show current settings'))
  .action(() => {
    const command = new ConfigCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// --- DEPRECATED COMMANDS (will be removed) ---

// Rules list command (deprecated)
program
  .command('rules:list')
  .alias('list')
  .description(chalk.gray('Show AI assistants (deprecated, use "agents")'))
  .action(() => {
    const command = new ListCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// Enable command (deprecated)
program
  .command('enable <rule>')
  .description(chalk.gray('Enable AI assistant (deprecated, use "agents enable")'))
  .action((rule) => {
    const command = new EnableCommand();
    const exitCode = command.execute(rule);
    process.exit(exitCode);
  });

// Disable command (deprecated)
program
  .command('disable <rule>')
  .description(chalk.gray('Disable AI assistant (deprecated, use "agents disable")'))
  .action((rule) => {
    const command = new DisableCommand();
    const exitCode = command.execute(rule);
    process.exit(exitCode);
  });

// Default action (show help)
program.action(() => {
  console.log(chalk.blue.bold('🤖 Rulesync - Sync Rules Across AI Assistants'));
  console.log('');
  console.log(chalk.green('Quick Start (Template-based):'));
  console.log('  1. ' + chalk.yellow('rulesync templates') + '                      - Browse 28+ templates');
  console.log('  2. ' + chalk.yellow('rulesync compose base/clean-code react') + '  - Compose from templates');
  console.log('  3. ' + chalk.yellow('rulesync generate') + '                       - Generate assistant files');
  console.log('  4. ' + chalk.yellow('rulesync gitignore') + '                      - Add to version control');
  console.log('');
  console.log(chalk.green('Alternative (Custom):'));
  console.log('  1. Create a ' + chalk.cyan('rulesync.md') + ' file with your coding rules');
  console.log('  2. Run ' + chalk.yellow('rulesync generate') + ' to create assistant-specific files');
  console.log('');
  console.log(chalk.green('Common Commands:'));
  console.log('  ' + chalk.yellow('rulesync templates') + '          Show available templates');
  console.log('  ' + chalk.yellow('rulesync compose [...]') + '      Compose rules from multiple sources');
  console.log('  ' + chalk.yellow('rulesync generate') + '           Create rule files from rulesync.md');
  console.log('  ' + chalk.yellow('rulesync agents') + '             List and manage AI assistants');
  console.log('');
  console.log('Run ' + chalk.cyan('rulesync --help') + ' for all commands');
});

// Handle unknown commands
program.on('command:*', () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(' ')}`));
  console.log('See --help for a list of available commands.');
  process.exit(1);
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
