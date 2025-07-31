# Rust Rules

*Based on Rust 1.75+ (2024 edition)*

## Ownership & Borrowing
- Always prefer borrowing (`&T`) over cloning when performance matters
- Use `Rc<T>` for shared ownership, `Arc<T>` for thread-safe sharing
- Use explicit lifetime annotations only when the compiler requires them
- Never fight the borrow checker - restructure code instead
- Let the compiler guide memory safety decisions

## Error Handling
- Always use `Result<T, E>` and `Option<T>` instead of panicking
- Implement `std::error::Error` for all custom error types
- Use `?` operator for error propagation in fallible functions
- Use `anyhow` for application errors, `thiserror` for library errors
- Never use `unwrap()` or `expect()` in production code without good reason

## Pattern Matching
- Always use `match` for exhaustive pattern matching
- Use `if let` only for single-pattern matches
- Always handle all enum variants in match statements
- Use destructuring to extract data from complex types
- Use `_` only when you truly don't care about the value

## Performance
- Always use iterators over manual loops (they're zero-cost)
- Pre-allocate `Vec` capacity with `Vec::with_capacity()` when size is known
- Understand when to implement `Copy` vs `Clone` traits
- Use `clone()` only when you need owned data
- Profile before optimizing - don't guess at bottlenecks

## Concurrency
- Use `async`/`await` for all I/O-bound operations
- Always prefer message passing over shared mutable state
- Use `Arc<Mutex<T>>` for shared mutable state when necessary
- Use `select!` for handling multiple async operations
- Handle cancellation properly with cancellation tokens

## Testing
- Write unit tests in `#[cfg(test)]` modules
- Use property-based testing with `proptest` for complex logic
- Always test error conditions, not just happy paths
- Use traits to make external dependencies mockable
- Test at the right level - unit tests for logic, integration tests for behavior