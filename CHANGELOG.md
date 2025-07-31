# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2025-07-31

### Fixed

- **Package Distribution**: Updated .npmignore to exclude deleted files (RELEASE_NOTES.md, EXAMPLE.md, PUBLISHING.md)
- **Git Ignore**: Removed duplicate `dist` entry and added generated rule files from development/testing
- **NPM Package**: Added new generated agent files to .npmignore (.aider.conf.yml, .continue/, .amazonq/, .vscode/cody.json)

### Technical Improvements

- Cleaner npm package distribution with only necessary files
- Better development workflow with proper ignore patterns

## [1.1.0] - 2025-07-31

### Added

- **4 New AI Assistants** - Expanded from 8 to 12 total supported assistants:
  - Aider → `.aider.conf.yml`
  - Continue.dev → `.continue/config.json`
  - Amazon Q Developer → `.amazonq/rules/coding-guidelines.md`
  - Sourcegraph Cody → `.vscode/cody.json`
- **New CLI Commands**:
  - `rulesync agents` - List and manage AI assistants (replaces `rules:list`)
  - `rulesync templates` - Browse available rule templates (replaces `examples`)
  - `rulesync compose` - Template-based rule composition system
- **Template System** - 28+ pre-built templates organized by category:
  - **Base templates**: clean-code, security, testing, documentation, performance, accessibility
  - **Language templates**: typescript, python, go, java, rust, csharp, php, swift, kotlin
  - **Framework templates**: react, django, express, nextjs, angular, vue, nodejs, rails, spring, laravel, flutter, fastapi, svelte
- **Content Filtering Service** - Intelligent content processing for rule composition
- **Comprehensive Documentation**:
  - Complete README.md overhaul with table of contents and cross-references
  - Explicit template listings (no more vague "And more" references)
  - User-focused quick start guide and workflow examples

### Changed

- **Terminology**: Renamed "rules" to "agents" throughout codebase for clarity
- **Directory Structure**: `src/rules/` → `src/agents/`, `examples/` → `templates/`
- **Test Organization**: Reorganized tests into logical directories (agents/, commands/, services/)
- **Dependencies**: Optimized for better compatibility and reduced conflicts:
  - axios: ^1.6.2 → ^1.10.0
  - chalk: ^5.3.0 → ^4.1.2 (CommonJS compatible)
  - inquirer: ^9.2.12 → ^8.2.6 (CommonJS compatible)
  - fs-extra: ^11.2.0 → ^11.3.0
- **Package Distribution**: Updated to include templates/ directory and exclude EXAMPLE.md

### Deprecated

- `rulesync rules:list` - Use `rulesync agents` instead (backwards compatible)
- `rulesync enable <rule>` - Use `rulesync agents enable <agent>` instead (backwards compatible)
- `rulesync disable <rule>` - Use `rulesync agents disable <agent>` instead (backwards compatible)

### Removed

- **EXAMPLE.md** - Consolidated into comprehensive README.md

### Fixed

- **Critical Security**: Updated form-data dependency to fix GHSA-fjxv-7rqg-78g4 vulnerability
- **Code Formatting**: Applied consistent Prettier formatting across all agent files
- **Test Coverage**: Updated all tests to reflect 12 agents instead of 8
- **Internal Links**: Fixed all cross-references in documentation

### Technical Improvements

- **100% Test Coverage**: 211 tests across 14 test suites
- **Zero Vulnerabilities**: All security issues resolved
- **Better Compatibility**: Eliminated ESM/CommonJS conflicts
- **Performance**: Reduced package bloat (52 fewer packages installed)
- **Type Safety**: Enhanced TypeScript interfaces and error handling

### Backwards Compatibility

- All existing CLI commands continue to work unchanged
- Generated file locations remain the same
- Configuration file format unchanged
- All existing workflows remain functional

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

[1.1.1]: https://github.com/dmccown1500/rulesync-ts/releases/tag/v1.1.1
[1.1.0]: https://github.com/dmccown1500/rulesync-ts/releases/tag/v1.1.0
[1.0.0]: https://github.com/dmccown1500/rulesync-ts/releases/tag/v1.0.0
