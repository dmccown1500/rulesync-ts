# Svelte Rules

*Based on Svelte 4.2+ (September 2023)*

## Component Structure
- Always use TypeScript with Svelte for type safety
- Use `<script lang="ts">` for all component scripts
- Keep component logic minimal - extract complex logic to utilities
- Always use reactive declarations ($:) for derived values
- Use stores for shared state between components

## Reactivity
- Always use `$:` reactive statements for derived state
- Use `$$restProps` to forward unknown props to child elements
- Always bind form inputs with `bind:value` directive
- Use `tick()` function when DOM updates are needed
- Never mutate props directly - dispatch events instead

## State Management
- Use built-in stores (writable, readable, derived) for state
- Always subscribe to stores using the `$` prefix syntax
- Create custom stores for complex state logic
- Use context API for component tree communication
- Keep store logic pure and testable

## Performance
- Use `{#key}` blocks to force re-rendering when needed
- Always provide keys for each blocks with dynamic data
- Use `bind:this` to get direct element references
- Implement lazy loading with dynamic imports
- Use `on:` event handlers efficiently

## Styling
- Use component-scoped styles by default
- Use `:global()` modifier sparingly for global styles
- Always use CSS custom properties for theming
- Use Svelte's class: directive for conditional classes
- Implement dark mode with CSS custom properties

## Testing
- Use @testing-library/svelte for component testing
- Test component behavior, not implementation details
- Use Vitest or Jest for unit testing
- Mock external dependencies and stores
- Test user interactions and edge cases