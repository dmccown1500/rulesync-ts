#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import {
  GenerateCommand,
  ListCommand,
  ConfigCommand,
  EnableCommand,
  DisableCommand,
  BaseCommand,
  GitignoreCommand
} from './commands';

const program = new Command();

program
  .name('rulesync')
  .description('Easily sync all of your favourite AI assistant instruction files')
  .version('1.0.0');

// Generate command
program
  .command('generate')
  .description('Generate AI assistant rule files')
  .option('--force', 'Force generation without prompts')
  .option('--overwrite', 'Overwrite existing files')
  .option('--from <path>', 'Custom source file path')
  .action(async (options) => {
    const command = new GenerateCommand();
    const exitCode = await command.execute(options);
    process.exit(exitCode);
  });

// Rules list command
program
  .command('rules:list')
  .alias('list')
  .description('Show available AI assistants')
  .action(() => {
    const command = new ListCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// Config command
program
  .command('config')
  .description('View current configuration')
  .action(() => {
    const command = new ConfigCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// Enable command
program
  .command('enable <rule>')
  .description('Enable specific AI assistant')
  .action((rule) => {
    const command = new EnableCommand();
    const exitCode = command.execute(rule);
    process.exit(exitCode);
  });

// Disable command
program
  .command('disable <rule>')
  .description('Disable specific AI assistant')
  .action((rule) => {
    const command = new DisableCommand();
    const exitCode = command.execute(rule);
    process.exit(exitCode);
  });

// Base command
program
  .command('base [path]')
  .description('Set base rules (URL or file path)')
  .action((path) => {
    const command = new BaseCommand();
    const exitCode = command.execute(path);
    process.exit(exitCode);
  });

// Gitignore command
program
  .command('gitignore:generate')
  .alias('gitignore')
  .description('Add AI assistant rule files to .gitignore')
  .action(() => {
    const command = new GitignoreCommand();
    const exitCode = command.execute();
    process.exit(exitCode);
  });

// Default action (show help)
program.action(() => {
  console.log(chalk.blue('Rulesync - AI Assistant Rules Synchronization Tool'));
  console.log('');
  console.log('Quick Start:');
  console.log('1. Create a rulesync.md file with your rules');
  console.log('2. Run "rulesync generate" to create all AI assistant rule files');
  console.log('3. Your rules are now synced across all supported AI assistants!');
  console.log('');
  program.help();
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
