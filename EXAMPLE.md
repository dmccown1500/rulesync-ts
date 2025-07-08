# Rulesync TypeScript - Example Usage

This document demonstrates how to use the TypeScript version of rulesync.

## Basic Usage

### 1. Create a rulesync.md file

```bash
cat > rulesync.md << 'EOF'
# AI Assistant Rules

You are a helpful AI assistant. Please follow these guidelines:

1. Always be concise and clear in your responses
2. Provide accurate information
3. If you're unsure about something, say so
4. Use proper formatting when presenting code or structured data
5. Be respectful and professional in all interactions

## Code Guidelines

- Use TypeScript when possible
- Follow clean code principles
- Add appropriate comments for complex logic
- Use meaningful variable and function names

## Communication Style

- Be friendly but professional
- Explain complex concepts in simple terms
- Ask clarifying questions when needed
EOF
```

### 2. Generate all AI assistant rule files

```bash
node dist/index.js generate --force
```

This will create:
- `CLAUDE.md` - Claude AI rules
- `.cursorrules` - Cursor IDE rules
- `.windsurfrules` - Windsurf IDE rules
- `GEMINI.md` - Gemini CLI rules
- `.github/copilot-instructions.md` - GitHub Copilot rules
- `.clinerules/project.md` - Cline rules
- `.junie/guidelines.md` - Junie rules
- `AGENTS.md` - OpenAI Codex rules

### 3. List available AI assistants

```bash
node dist/index.js rules:list
```

### 4. Disable/Enable specific assistants

```bash
# Disable Cursor rules
node dist/index.js disable cursor

# Enable Cursor rules
node dist/index.js enable cursor
```

### 5. View configuration

```bash
node dist/index.js config
```

### 6. Add rule files to .gitignore

```bash
node dist/index.js gitignore:generate
```

### 7. Set base rules (optional)

```bash
# From a URL
node dist/index.js base https://example.com/base-rules.md

# From a local file
node dist/index.js base ./base-rules.md

# View current base rules
node dist/index.js base
```

## Advanced Usage

### Custom source file

```bash
node dist/index.js generate --from ./custom-rules.md
```

### Force overwrite existing files

```bash
node dist/index.js generate --overwrite
```

### Generate without prompts

```bash
node dist/index.js generate --force
```

## File Structure

After running rulesync, your project will have:

```
project/
├── rulesync.md                           # Your source rules
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
└── .rulesync/
    └── rulesync.json                   # Local configuration
```

## Global vs Local Configuration

- **Local**: Configuration stored in `./.rulesync/rulesync.json`
- **Global**: Configuration stored in `~/.config/rulesync/rulesync.json`

Rulesync automatically detects if you're in a project directory (has `package.json` or `composer.json`) and uses local configuration accordingly.
