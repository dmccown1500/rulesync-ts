# Swift Rules

*Based on Swift 5.9+ (September 2023)*

## Optionals & Safety
- Always use optionals for values that might be nil
- Use guard statements for early returns with unwrapping
- Never force unwrap with `!` unless you're absolutely certain
- Use nil coalescing operator `??` for default values
- Always handle optionals safely with if-let or guard-let

## Value Types vs Reference Types
- Always prefer structs over classes when possible
- Use classes only when reference semantics are needed
- Always use value types for data models
- Use copy-on-write for expensive-to-copy value types
- Always understand the difference between value and reference semantics

## Error Handling
- Always use do-catch blocks for throwing functions
- Create custom error types conforming to Error protocol
- Use guard statements with try for early error returns
- Always handle errors appropriately - don't ignore them
- Use Result type for functions that can fail

## Memory Management
- Always use weak references to break retain cycles
- Use unowned references only when you're certain the object won't be deallocated
- Always use [weak self] in closures to avoid retain cycles
- Use defer statements for cleanup code
- Monitor memory usage and fix leaks promptly

## Protocols & Generics
- Always use protocols to define interfaces and contracts
- Use protocol extensions for default implementations
- Always constrain generics with protocols when possible
- Use associated types in protocols for flexible designs
- Prefer composition over inheritance using protocols

## Testing
- Always write unit tests using XCTest framework
- Use dependency injection to make code testable
- Always mock external dependencies and services
- Test both success and failure scenarios
- Use UI tests for critical user flows