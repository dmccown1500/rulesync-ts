# React Rules

*Based on React 18+ (March 2022)*

## Component Design
- Always use functional components over class components
- Define TypeScript interfaces for all component props
- Use React.FC type annotation for components
- Provide default values for optional props
- Keep components small and focused on single responsibility

## Hooks Usage
- Always include all dependencies in useEffect dependency arrays
- Use useCallback for functions passed as props to memoized components
- Use useMemo for expensive calculations only
- Create custom hooks for reusable stateful logic
- Always clean up effects (event listeners, timers, subscriptions)

## State Management
- Use useState for local component state
- Use useReducer for complex state logic
- Use React Context only for truly global state
- Lift state up to the nearest common ancestor when sharing
- Never mutate state directly - always use setState functions

## Performance
- Wrap components in React.memo when appropriate
- Use React.lazy and Suspense for code splitting
- Avoid creating objects/functions in render (move outside or use useMemo/useCallback)
- Use key prop correctly for list items
- Implement virtualization for large lists

## Error Handling
- Always implement Error Boundaries for component trees
- Use error states in components for user-facing errors
- Never let errors crash the entire application
- Provide fallback UI for error states
- Log errors appropriately for debugging

## Testing
- Use React Testing Library for component tests
- Test user interactions, not implementation details
- Create custom render functions with providers
- Mock external dependencies and API calls
- Test both happy path and error conditions