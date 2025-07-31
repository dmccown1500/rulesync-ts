# TypeScript Rules

*Based on TypeScript 5.3+ (January 2024)*

## Type Safety
- Always enable strict mode in tsconfig.json
- Use explicit types for all function parameters and return values
- Never use `any` - use `unknown` or specific union types instead
- Prefer interfaces over type aliases for object shapes
- Use generic types to make components reusable

## Error Handling
- Use Result/Either patterns for operations that can fail
- Create specific error classes that extend Error
- Use type guards for runtime type checking
- Handle all possible union type cases in switch statements
- Never suppress TypeScript errors with `@ts-ignore`

## Code Organization
- Use barrel exports (index.ts files) for clean imports
- Organize types close to where they're used
- Use namespace or module organization for large codebases
- Prefer named exports over default exports
- Use path mapping in tsconfig for cleaner imports

## Performance
- Use `const assertions` for immutable data
- Prefer `readonly` arrays and properties when data won't change
- Use lazy initialization for expensive operations
- Enable incremental compilation for large projects
- Use `satisfies` operator for better type inference

## Testing
- Type your test mocks properly with jest.Mocked<T>
- Use type-level tests for complex type logic
- Test both happy path and error conditions
- Mock external dependencies at the module boundary
- Use factories for creating test data with proper types