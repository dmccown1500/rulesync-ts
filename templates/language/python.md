# Python Rules

*Based on Python 3.12+ (October 2023)*

## Code Style
- Always follow PEP 8 style guidelines
- Use meaningful, descriptive variable and function names
- Keep line length under 88-100 characters (Black formatter standard)
- Always use type hints for function signatures and class attributes
- Always group imports: standard library, third-party, local modules

## Functions & Classes
- Keep all functions small and focused on single tasks
- Always write docstrings for public functions and classes
- Always prefer composition over inheritance
- Use `@property` decorator for computed attributes
- Always follow naming conventions (snake_case for functions/variables)

## Error Handling
- Always use specific exception types, never bare `except:`
- Follow EAFP principle: "Easier to Ask for Forgiveness than Permission"
- Always use context managers (`with` statements) for resource management
- Never suppress exceptions without good reason
- Always provide meaningful error messages with context

## Data Structures
- Use list comprehensions and generator expressions for transformations
- Use `collections` module types (Counter, defaultdict, deque) when appropriate
- Always use `dataclasses` for simple data containers instead of regular classes
- Understand mutability: use tuples/frozensets for immutable data
- Always use `dict.get(key, default)` instead of key existence checking

## Performance
- Always use built-in functions (they're optimized in C)
- Always profile before optimizing (`cProfile`, `timeit`)
- Use `numpy` for numerical computations with large datasets
- Use generators for memory-efficient iteration over large datasets
- Use `@lru_cache` decorator for expensive function calls

## Testing
- Always write tests with `pytest` framework
- Use fixtures for test data setup and teardown
- Always mock external dependencies (APIs, databases, file system)
- Test edge cases and error conditions, not just happy paths
- Focus test coverage on critical business logic