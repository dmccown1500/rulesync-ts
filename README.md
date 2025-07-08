# Rulesync TypeScript

Easily sync all of your favourite AI assistant instruction files (e.g. `.cursorrules`, `copilot-instructions.md`, `GEMINI.md`, `CLAUDE.md`, `AGENTS.md`, `.clinerules/project.md`).

This is a TypeScript rewrite of the original [rulesync](https://github.com/jpcaparas/rulesync) PHP project.

## Installation

### Option 1: Global Installation (Recommended)

```bash
npm install -g rulesync-ts
```

### Option 2: Development Installation

```bash
git clone <repository-url>
cd rulesync-ts
npm install
npm run build
npm link
```

## Quick Start

1. Create a `rulesync.md` file with your rules
2. Run `rulesync generate` to create all AI assistant rule files
3. Your rules are now synced across Claude, Cursor, Windsurf, Gemini CLI, GitHub Copilot, OpenAI Codex, Cline, and Junie!

```bash
# Create your rules file
echo "# My AI Assistant Rules\n\nAlways be helpful and concise." > rulesync.md

# Generate all rule files
rulesync generate
```

## Commands

- `rulesync rules:list` - Show available AI assistants
- `rulesync generate` - Generate rule files from rulesync.md
- `rulesync gitignore:generate` - Add AI assistant rule files to .gitignore
- `rulesync config` - View current configuration
- `rulesync disable <n>` - Disable specific AI assistant
- `rulesync enable <n>` - Enable specific AI assistant
- `rulesync base <path>` - Set base rules (URL or file path)

## Supported AI Assistants

- **Claude** → `CLAUDE.md`
- **Cline** → `.clinerules/project.md`
- **Cursor** → `.cursorrules`
- **Gemini CLI** → `GEMINI.md`
- **GitHub Copilot** → `.github/copilot-instructions.md`
- **Junie** → `.junie/guidelines.md`
- **OpenAI Codex** → `AGENTS.md`
- **Windsurf** → `.windsurfrules`

## Features

### Rule Augmentation

If you have both local (`./rulesync.md`) and global (`~/.config/rulesync/rulesync.md`) rule files, rulesync can combine them automatically.

### Base Rules

Set base rules that will be appended to all generated files:

```bash
# From a URL
rulesync base https://example.com/base-rules.md

# From a local file
rulesync base ./base-rules.md
```

### Selective Generation

Enable or disable specific AI assistants:

```bash
# Disable Cursor rules
rulesync disable cursor

# Enable Claude rules
rulesync enable claude

# List all assistants and their status
rulesync rules:list
```

### Gitignore Integration

Automatically add AI assistant rule files to your `.gitignore`:

```bash
rulesync gitignore:generate
```

## Configuration

Configuration is stored in:
- Local projects: `./.rulesync/rulesync.json`
- Global: `~/.config/rulesync/rulesync.json`

View current configuration:

```bash
rulesync config
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Requirements

- Node.js >= 18.0.0

## License

MIT

## Credits

This is a TypeScript rewrite of the original [rulesync](https://github.com/jpcaparas/rulesync) project by JP Caparas.
