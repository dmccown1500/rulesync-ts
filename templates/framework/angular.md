# Angular Rules

*Based on Angular 17+ (November 2023)*

## Component Architecture
- Always use standalone components for new development
- Use OnPush change detection strategy for all components
- Always implement OnDestroy interface for cleanup
- Use TrackBy functions for ngFor loops with dynamic data
- Keep components focused on presentation logic only

## Dependency Injection
- Always use constructor injection for dependencies
- Use providedIn: 'root' for singleton services
- Create feature-specific services at appropriate levels
- Always use interfaces for service contracts
- Use injection tokens for configuration values

## RxJS & Async Patterns
- Always use RxJS operators for data transformation
- Use async pipe in templates instead of manual subscriptions
- Always unsubscribe from observables in ngOnDestroy
- Use takeUntil pattern with destroyed$ subject for cleanup
- Prefer switchMap, mergeMap, concatMap over nested subscriptions

## Forms
- Always use Reactive Forms over Template-driven forms
- Use FormBuilder service to create form groups
- Implement custom validators for business logic
- Always validate forms both client-side and server-side
- Use FormArray for dynamic form controls

## Performance
- Always use OnPush change detection strategy
- Use lazy loading for feature modules
- Implement virtual scrolling for large lists
- Use tree-shaking friendly imports
- Avoid function calls in templates - use pipes or getters

## Testing
- Write unit tests with Jasmine and Karma
- Use TestBed for component testing setup
- Always mock dependencies in unit tests
- Use Page Object Model for e2e tests
- Test component inputs, outputs, and user interactions