# Rulesync TypeScript

> 🚀 **Sync AI assistant rules across Claude, Cursor, Windsurf, GitHub Copilot, and more!**

Rulesync is a powerful CLI tool that helps you maintain consistent AI assistant instructions across all your favorite tools. Compose rules from templates or create custom ones, then generate agent-specific files automatically.

[![npm version](https://badge.fury.io/js/rulesync-ts.svg)](https://www.npmjs.com/package/rulesync-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
- [Two Ways to Create Rules](#two-ways-to-create-rules)
  - [Option 1: Use Templates (Recommended)](#option-1-use-templates-recommended)
  - [Option 2: Write Your Own](#option-2-write-your-own)
- [Available Templates](#available-templates)
  - [Base Templates](#base-templates)
  - [Language Templates](#language-templates)
  - [Framework Templates](#framework-templates)
- [Supported AI Assistants](#supported-ai-assistants)
- [Commands](#commands)
  - [Core Commands](#core-commands)
  - [Examples](#examples)
- [Configuration](#configuration)
  - [Base Rules](#base-rules)
  - [Agent Management](#agent-management)
  - [Configuration Files](#configuration-files)
- [Workflow Examples](#workflow-examples)
- [Generated File Structure](#generated-file-structure)
- [Advanced Usage](#advanced-usage)
- [Development](#development)
- [Requirements](#requirements)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)

## Features

- 🎯 **Template-based composition** - Choose from 28+ pre-built rule templates
- 🤖 **12 AI assistants supported** - Claude, Cursor, Windsurf, GitHub Copilot, Gemini, Cline, Junie, OpenAI Codex, Aider, Continue.dev, Amazon Q Developer, Sourcegraph Cody
- 📝 **Smart rule generation** - One source, multiple agent-specific formats
- 🎨 **Flexible composition** - Mix templates, local files, and remote URLs
- ⚙️ **Selective control** - Enable/disable specific assistants
- 📁 **Gitignore integration** - Automatically manage version control

## Quick Start

### Installation

```bash
npm install -g rulesync-ts
```

### Basic Usage

```bash
# 1. See available templates
rulesync templates

# 2. Compose rules from templates
rulesync compose base/clean-code language/typescript framework/react

# 3. Generate AI assistant files
rulesync generate

# 4. Add to gitignore
rulesync gitignore
```

That's it! You now have consistent rules across all your AI assistants.

## Two Ways to Create Rules

### Option 1: Use Templates (Recommended)

Use the `compose` command to build your `rulesync.md` from [pre-built templates](#available-templates):

```bash
# Compose from templates - creates rulesync.md automatically
rulesync compose base/clean-code language/typescript framework/react
rulesync generate
```

### Option 2: Write Your Own

Create a `rulesync.md` file manually with your custom rules:

```markdown
# My AI Assistant Rules

You are a helpful AI assistant. Please follow these guidelines:

1. Always be concise and clear in your responses
2. If you're unsure about something, say so

## Code Guidelines

- Follow clean code principles
- Add comments for complex logic
```

Then generate AI assistant files from your custom rules:

```bash
rulesync generate
```

Both approaches create the same result - AI assistant files generated from your `rulesync.md` source file!

## Available Templates

### Base Templates

- **clean-code** - Robert Martin's Clean Code principles
- **no-sycophancy** - Direct, honest communication without excessive praise
- **security** - Security best practices and guidelines
- **testing** - Testing strategies and methodologies
- **documentation** - Documentation standards
- **performance** - Performance optimization guidelines
- **accessibility** - Web accessibility standards

### Language Templates

- **typescript** - TypeScript best practices and patterns
- **python** - Python coding standards and idioms
- **go** - Go language conventions and practices
- **java** - Java development guidelines
- **rust** - Rust programming patterns
- **csharp** - C# development guidelines and patterns
- **php** - PHP coding standards and best practices
- **swift** - Swift programming language conventions
- **kotlin** - Kotlin development best practices

### Framework Templates

- **react** - React component and hook patterns
- **django** - Django web framework conventions
- **express** - Express.js API development practices
- **nextjs** - Next.js development guidelines
- **angular** - Angular application patterns
- **vue** - Vue.js component guidelines
- **nodejs** - Node.js server development patterns
- **rails** - Ruby on Rails framework conventions
- **spring** - Spring Boot Java framework patterns
- **laravel** - Laravel PHP framework best practices
- **flutter** - Flutter mobile development guidelines
- **fastapi** - FastAPI Python framework patterns
- **svelte** - Svelte framework development practices

## Supported AI Assistants

Rulesync generates configuration files for these AI assistants. You can [enable/disable specific assistants](#agent-management) as needed.

| Assistant              | File Location                         |
| ---------------------- | ------------------------------------- |
| **Claude**             | `CLAUDE.md`                           |
| **Cursor**             | `.cursorrules`                        |
| **Windsurf**           | `.windsurfrules`                      |
| **GitHub Copilot**     | `.github/copilot-instructions.md`     |
| **Gemini CLI**         | `GEMINI.md`                           |
| **Cline**              | `.clinerules/project.md`              |
| **Junie**              | `.junie/guidelines.md`                |
| **OpenAI Codex**       | `AGENTS.md`                           |
| **Aider**              | `.aider.conf.yml`                     |
| **Continue.dev**       | `.continue/config.json`               |
| **Amazon Q Developer** | `.amazonq/rules/coding-guidelines.md` |
| **Sourcegraph Cody**   | `.vscode/cody.json`                   |

## Commands

### Core Commands

```bash
# List available templates
rulesync templates

# Compose rules from templates and files
rulesync compose <template1> <template2> [files...]

# Generate AI assistant files
rulesync generate [options]

# Manage AI assistants
rulesync agents [enable|disable] [assistant]

# View configuration
rulesync config

# Add files to .gitignore
rulesync gitignore

# Set base rules
rulesync base [path]
```

> **Note**: For details on managing AI assistants, see [Agent Management](#agent-management)

### Examples

```bash
# Single template
rulesync compose base/clean-code

# Multiple templates
rulesync compose base/clean-code language/python framework/django

# Mix templates with custom files
rulesync compose base/security ./company-guidelines.md

# Remote URLs
rulesync compose base/clean-code https://example.com/team-rules.md

# Generate with options
rulesync generate --force
rulesync generate --from ./custom-rules.md
```

## Configuration

### Base Rules

Set persistent base rules that are included in all generations. These work alongside [templates](#available-templates) and custom files:

```bash
# From a URL
rulesync base https://company.com/coding-standards.md

# From a local file
rulesync base ./team-guidelines.md

# View current base rules
rulesync base
```

### Agent Management

Control which [AI assistants](#supported-ai-assistants) are active:

```bash
# List all agents
rulesync agents

# Disable specific agent
rulesync agents disable cursor

# Enable specific agent
rulesync agents enable cursor
```

### Configuration Files

- **Local**: `./.rulesync/rulesync.json` (project-specific)
- **Global**: `~/.config/rulesync/rulesync.json` (user-wide)

Rulesync automatically detects if you're in a project directory (has `package.json` or `composer.json`) and uses local configuration accordingly.

## Workflow Examples

These examples demonstrate different ways to use rulesync. For a complete command reference, see [Commands](#commands).

### For a TypeScript React Project

```bash
rulesync compose base/clean-code base/testing language/typescript framework/react
rulesync generate --force
rulesync gitignore
```

### For a Python Django API

```bash
rulesync compose base/clean-code base/security language/python framework/django
rulesync generate --force
rulesync gitignore
```

### With Custom Company Rules

```bash
rulesync base https://company.com/coding-standards.md
rulesync compose base/clean-code language/typescript ./project-specific.md
rulesync generate --force
```

## Generated File Structure

After running `rulesync generate`, your project will have files for all [supported AI assistants](#supported-ai-assistants):

```
project/
├── rulesync.md                           # Composed source rules
├── CLAUDE.md                            # Claude AI rules
├── .cursorrules                         # Cursor IDE rules
├── .windsurfrules                       # Windsurf IDE rules
├── GEMINI.md                           # Gemini CLI rules
├── AGENTS.md                           # OpenAI Codex rules
├── .github/
│   └── copilot-instructions.md         # GitHub Copilot rules
├── .clinerules/
│   └── project.md                      # Cline rules
├── .junie/
│   └── guidelines.md                   # Junie rules
├── .aider.conf.yml                     # Aider rules
├── .continue/
│   └── config.json                     # Continue.dev rules
├── .amazonq/
│   └── rules/
│       └── coding-guidelines.md        # Amazon Q Developer rules
├── .vscode/
│   └── cody.json                       # Sourcegraph Cody rules
├── .gitignore                          # Updated with AI assistant files
└── .rulesync/
    └── rulesync.json                   # Local configuration
```

## Advanced Usage

### Custom Source Files

By default, rulesync uses `rulesync.md` (created via [templates](#available-templates) or [manually](#option-2-write-your-own)). You can also specify custom source files:

```bash
# Generate from custom file instead of rulesync.md
rulesync generate --from ./api-guidelines.md

# Force overwrite without prompts
rulesync generate --force

# Overwrite existing files (with prompts)
rulesync generate --overwrite
```

### Composition Options

```bash
# Force composition without prompts
rulesync compose --force base/clean-code language/go

# Interactive composition (shows available templates)
rulesync compose
```

### Configuration Management

```bash
# View detailed configuration
rulesync config

# Reset to defaults (disables no agents)
rm .rulesync/rulesync.json
```


## Development

```bash
# Clone and setup
git clone https://github.com/dmccown1500/rulesync-ts.git
cd rulesync-ts
npm install

# Development
npm run dev          # Run in development mode
npm run build        # Build the project
npm test             # Run tests
npm run lint         # Lint code
npm run format       # Format code
```

## Requirements

- Node.js >= 18.0.0

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

This is a TypeScript rewrite of the original [rulesync](https://github.com/jpcaparas/rulesync) project by JP Caparas, enhanced with modern template-based composition and expanded AI assistant support.

---

⭐ **Like this project? Give it a star on GitHub!**
