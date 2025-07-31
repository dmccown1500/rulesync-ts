# PHP Rules

*Based on PHP 8.3+ (November 2023)*

## Type Safety
- Always use strict types with `declare(strict_types=1)` at the top of files
- Always use type hints for function parameters and return types
- Use union types (PHP 8.0+) when parameters can accept multiple types
- Always use nullable types (?string) when values can be null
- Never rely on type coercion - be explicit with types

## Object-Oriented Programming
- Always use visibility modifiers (private, protected, public) for all properties
- Use final classes when inheritance is not intended
- Always use dependency injection instead of creating dependencies directly
- Use abstract classes for shared implementation, interfaces for contracts
- Always implement proper __toString() methods for objects

## Error Handling
- Always use exceptions for error handling, not error codes
- Create custom exception classes for specific error types
- Always use try-catch blocks for operations that can fail
- Never suppress errors with @ operator in production code
- Always log exceptions with proper context

## Security
- Always validate and sanitize user input
- Use prepared statements for all database queries
- Never trust user input - validate everything server-side
- Always escape output to prevent XSS attacks
- Use password_hash() and password_verify() for password handling

## Modern PHP Features
- Always use constructor property promotion (PHP 8.0+)
- Use match expressions instead of switch when appropriate
- Always use arrow functions for simple callbacks
- Use named arguments for functions with many parameters
- Always use readonly properties when values shouldn't change

## Testing
- Always write unit tests with PHPUnit
- Use data providers for testing multiple scenarios
- Always mock external dependencies
- Test both success and failure scenarios
- Use descriptive test method names that explain the scenario