# Flutter Rules

*Based on Flutter 3.16+ (November 2023)*

## Widget Architecture
- Always use StatelessWidget when possible, StatefulWidget only when needed
- Keep widgets small and focused on single responsibility
- Always use const constructors for widgets that don't change
- Use composition over inheritance for widget reuse
- Always provide keys for widgets in lists or when order can change

## State Management
- Use Provider or Riverpod for state management
- Keep state as close to where it's used as possible
- Always use immutable state objects
- Use StateNotifier or ChangeNotifier for complex state logic
- Never use setState for global state - use proper state management

## Performance
- Always use const constructors for static widgets
- Use RepaintBoundary for expensive widgets that rarely change
- Always provide itemExtent for ListView when possible
- Use ListView.builder for large or infinite lists
- Implement lazy loading for expensive operations

## UI & Layouts
- Always use MediaQuery for responsive design
- Use flexible layouts (Row, Column, Flex) over fixed positioning
- Always handle different screen sizes and orientations
- Use Theme.of(context) for consistent styling
- Implement proper accessibility with semantic widgets

## Navigation
- Always use named routes for complex navigation
- Use Navigator 2.0 for complex routing scenarios
- Always handle back button behavior properly
- Use proper route transitions and animations
- Never use context after widget disposal

## Testing
- Write widget tests for UI components
- Use mockito for mocking dependencies
- Test both widget behavior and business logic
- Always test different screen sizes and orientations
- Use integration tests for complete user flows