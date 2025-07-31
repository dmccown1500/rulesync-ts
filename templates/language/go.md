# Go Rules

*Based on Go 1.21+ (August 2023)*

## Code Style
- Always run `gofmt` on all code before committing
- Use meaningful package names that are short and clear
- Always use camelCase for variables and functions, PascalCase for exported items
- Keep line length reasonable (typically under 100 characters)
- Use goimports to manage imports automatically

## Error Handling
- Always check errors explicitly - never ignore returned errors
- Use `fmt.Errorf()` with `%w` verb to wrap errors with context
- Create custom error types for specific error conditions
- Always return errors as the last return value
- Never use panic() for normal error conditions - only for unrecoverable errors

## Interfaces & Types
- Always prefer small interfaces with 1-3 methods
- Define interfaces at the point of use, not at the point of implementation
- Use composition over inheritance through embedded structs
- Always use pointer receivers for methods that modify the receiver
- Use value receivers for methods that don't modify the receiver

## Concurrency
- Always use goroutines for concurrent operations
- Use channels for communication between goroutines
- Always use `sync.WaitGroup` to wait for goroutines to complete
- Use `context.Context` for cancellation and timeouts
- Always close channels when no more data will be sent

## Memory Management
- Always pass large structs by pointer to avoid copying
- Use `make()` with capacity for slices when size is known
- Always close resources (files, connections) with defer statements
- Use object pools for frequently allocated objects
- Avoid memory leaks by properly managing goroutine lifecycles

## Testing
- Always write tests in `*_test.go` files
- Use table-driven tests for testing multiple scenarios
- Always test error conditions, not just happy paths
- Use `testing.T.Helper()` for test helper functions
- Use benchmarks for performance-critical code