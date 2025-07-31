# Kotlin Rules

*Based on Kotlin 1.9+ (July 2023)*

## Null Safety
- Always use nullable types (T?) only when values can actually be null
- Use safe call operator (?.) instead of explicit null checks
- Use elvis operator (?:) for default values with nullables
- Never use `!!` operator unless you're absolutely certain value is not null
- Always use let, run, or apply for safe null handling

## Data Classes & Objects
- Always use data classes for simple data containers
- Use object declarations for singletons
- Always override equals, hashCode, and toString together when needed
- Use sealed classes for restricted class hierarchies
- Always use companion objects instead of static members

## Functions & Lambdas
- Always use single-expression functions when body is one expression
- Use trailing lambda syntax when lambda is the last parameter
- Always use it parameter for single-parameter lambdas
- Use higher-order functions for functional programming patterns
- Always use inline functions for performance-critical lambdas

## Coroutines & Async
- Always use coroutines for asynchronous programming
- Use suspend functions for operations that can be cancelled or take time
- Always use structured concurrency with coroutineScope
- Use appropriate coroutine dispatchers (Main, IO, Default)
- Always handle exceptions in coroutines with try-catch or supervisorJob

## Collections
- Always use immutable collections by default (listOf, mapOf, setOf)
- Use mutable collections (mutableListOf) only when modification is needed
- Always use extension functions for collection operations
- Use sequences for lazy evaluation of large datasets
- Always use appropriate collection types for your use case

## Testing
- Always write unit tests with JUnit or Kotest
- Use MockK for mocking in Kotlin projects
- Always test coroutines with runTest and TestCoroutineDispatcher
- Test both success and failure scenarios
- Use descriptive test function names with backticks