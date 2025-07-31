# C# Rules

*Based on C# 12 (.NET 8, November 2023)*

## Code Style
- Always use PascalCase for public members, camelCase for private fields
- Use meaningful names that clearly describe purpose
- Always use `var` when the type is obvious from the right side
- Use nullable reference types in new projects
- Always follow Microsoft's C# coding conventions

## Object-Oriented Design
- Always use properties instead of public fields
- Use abstract classes for shared implementation, interfaces for contracts
- Always implement IDisposable for classes managing unmanaged resources
- Use sealed classes when inheritance is not intended
- Always override Equals and GetHashCode together when needed

## Async Programming
- Always use async/await for I/O-bound operations
- Never use Task.Result or Task.Wait() - use await instead
- Always use ConfigureAwait(false) in library code
- Use CancellationToken for long-running operations
- Never use async void except for event handlers

## Exception Handling
- Always use specific exception types, not Exception base class
- Use try-catch-finally or using statements for resource cleanup
- Never catch and ignore exceptions without logging
- Always validate parameters and throw ArgumentException for invalid inputs
- Use finally blocks or using statements for cleanup

## Collections & LINQ
- Always use generic collections (List<T>, Dictionary<TKey,TValue>)
- Use LINQ for data querying and transformation
- Always use appropriate collection types (List vs Array vs IEnumerable)
- Use concurrent collections for thread-safe operations
- Always dispose of IEnumerable results when needed

## Testing
- Always write unit tests with MSTest, NUnit, or xUnit
- Use dependency injection to make code testable
- Always mock external dependencies
- Test both success and failure scenarios
- Use descriptive test method names that explain the scenario