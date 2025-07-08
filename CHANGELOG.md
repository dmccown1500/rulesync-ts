# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-08

### Added
- Complete TypeScript rewrite of the original PHP rulesync project
- CLI interface with Commander.js for all commands
- Support for 8 AI assistants:
  - Claude → `CLAUDE.md`
  - Cursor → `.cursorrules`
  - Windsurf → `.windsurfrules`
  - Gemini CLI → `GEMINI.md`
  - GitHub Copilot → `.github/copilot-instructions.md`
  - Cline → `.clinerules/project.md`
  - Junie → `.junie/guidelines.md`
  - OpenAI Codex → `AGENTS.md`
- Core commands:
  - `generate` - Generate AI assistant rule files from rulesync.md
  - `rules:list` - Show available AI assistants with status
  - `config` - View current configuration
  - `enable <rule>` - Enable specific AI assistant
  - `disable <rule>` - Disable specific AI assistant
  - `base [path]` - Set base rules from URL or file path
  - `gitignore:generate` - Add AI assistant rule files to .gitignore
- Configuration management with local and global support
- Rule augmentation (combine local and global rule files)
- Base rules support from URLs or local files
- VCS checking with warnings for non-version-controlled directories
- Interactive prompts with Inquirer.js
- Colored output with Chalk
- Comprehensive test suite with Jest
  - 32 tests for individual rule properties
  - 6 tests for RuleDiscoveryService functionality
  - Total: 38 passing tests
- TypeScript with strict configuration
- ESLint and Prettier for code quality
- MIT License
- Comprehensive documentation:
  - README.md with installation and usage instructions
  - EXAMPLE.md with detailed usage examples
  - Installation script (install.sh)

### Technical Details
- Built with Node.js 18+ and TypeScript 5.3+
- Uses modern ES2020 features
- Modular architecture with services and commands
- Type-safe interfaces for all AI assistant rules
- Async/await for all file operations and HTTP requests
- Error handling with proper exit codes
- Cross-platform compatibility (macOS, Linux, Windows)

### Dependencies
- commander: CLI framework
- chalk: Terminal colors
- inquirer: Interactive prompts
- axios: HTTP requests for base rules
- fs-extra: Enhanced file system operations

### Development Dependencies
- TypeScript compiler and type definitions
- Jest for testing
- ESLint and Prettier for code quality
- tsx for development execution

[1.0.0]: https://github.com/yourusername/rulesync-ts/releases/tag/v1.0.0
