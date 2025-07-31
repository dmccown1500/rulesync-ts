# Clean Code Rules

## Naming
- Always use clear, searchable names: `getUserAccount()` not `getUA()`
- Make functions verbs: `calculateTotal()`, `validateInput()`
- Make classes nouns: `User`, `PaymentProcessor`
- Never use abbreviations or single-letter variables except for loop counters
- Be consistent with naming patterns across the entire codebase

## Functions
- Keep all functions small (under 20 lines when possible)
- Each function must do exactly one thing
- Use descriptive function names instead of comments
- Limit function parameters to 3 or fewer
- Never allow side effects or hidden behaviors

## Error Handling
- Always use proper error types/exceptions, never return error codes
- Include specific context in all error messages
- Never use empty catch blocks or ignore errors
- Fail fast with clear error messages
- Always clean up resources properly

## Comments
- Only add comments to explain complex business logic or "why" decisions
- Never comment obvious code
- Remove any commented-out code
- Update comments when you change the code
- Prefer self-documenting code over comments

## Code Organization
- Group related code together
- Use consistent indentation throughout
- Keep lines under 100 characters
- Add blank lines to separate logical sections
- Follow the established code style of the project

## Core Principles
- KISS: Always choose the simplest solution that works
- DRY: Never duplicate code - extract common logic into reusable functions
- YAGNI: Only implement features that are actually needed right now
- Boy Scout Rule: Always leave code cleaner than you found it
- Single Responsibility: Each class/function should have one reason to change
- Composition over inheritance: Prefer composing objects over class inheritance