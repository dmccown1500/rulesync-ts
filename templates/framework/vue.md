# Vue.js Rules

*Based on Vue 3.4+ (December 2023)*

## Composition API
- Always use Composition API over Options API for new components
- Use `<script setup>` syntax for all Single File Components
- Always use TypeScript with Vue for type safety
- Use `ref()` for primitive values, `reactive()` for objects
- Always use `computed()` for derived state, never methods

## Component Design
- Always use PascalCase for component names
- Use Single File Components (.vue) for all components
- Keep components small and focused on single responsibility
- Always define props with TypeScript interfaces
- Use `defineEmits()` for component events with proper typing

## Reactivity
- Always use `ref()` and `reactive()` for reactive state
- Use `watch()` for side effects, `watchEffect()` for reactive effects
- Always use `nextTick()` when DOM updates are needed
- Never mutate props directly - emit events instead
- Use `readonly()` to prevent accidental mutations

## Performance
- Use `v-memo` directive for expensive list renders
- Always provide keys for v-for loops
- Use `shallowRef()` and `shallowReactive()` for large objects
- Implement lazy loading with `defineAsyncComponent()`
- Use `v-once` directive for static content that never changes

## State Management
- Use Pinia for global state management
- Keep local state in components when possible
- Always type your Pinia stores with TypeScript
- Use composables for reusable logic
- Never use Vuex for new projects - use Pinia instead

## Testing
- Use Vue Test Utils with Vitest for component testing
- Always test component behavior, not implementation details
- Mock external dependencies and API calls
- Test both user interactions and edge cases
- Use data-testid attributes for reliable element selection