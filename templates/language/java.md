# Java Rules

*Based on Java 21 LTS (September 2023)*

## Object-Oriented Design
- Always follow SOLID principles in class design
- Always favor composition over inheritance
- Program to interfaces, never to concrete implementations
- Use dependency injection instead of direct instantiation
- Keep classes focused on a single responsibility

## Exception Handling
- Use checked exceptions only for recoverable conditions
- Use unchecked exceptions for programming errors
- Always create meaningful exception hierarchies
- Always use try-with-resources for resource management
- Never catch exceptions without handling them appropriately

## Collections & Generics
- Always use the most specific collection interface (List, Set, Map)
- Always use generics to ensure type safety
- Prefer immutable collections (Collections.unmodifiableList()) when possible
- Use streams for data processing over traditional loops
- Understand performance characteristics (ArrayList vs LinkedList)

## Concurrency
- Always use `ExecutorService` instead of creating raw threads
- Use `CompletableFuture` for all async operations
- Use concurrent collections (`ConcurrentHashMap`) for thread safety
- Always handle thread interruption properly
- Never use blocking operations in async code

## Memory Management
- Minimize object creation in performance-critical paths
- Use object pooling only for expensive-to-create objects
- Always implement proper `equals()` and `hashCode()` together
- Be careful with static references to prevent memory leaks
- Monitor memory usage and garbage collection behavior

## Testing
- Always write unit tests with JUnit 5
- Use Mockito for mocking external dependencies
- Always follow AAA pattern (Arrange-Act-Assert)
- Test edge cases and error conditions, not just happy paths
- Use parameterized tests (`@ParameterizedTest`) for multiple scenarios