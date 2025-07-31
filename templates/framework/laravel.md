# Laravel Rules

*Based on Laravel 10+ (February 2023)*

## Application Structure
- Always follow Laravel's directory structure conventions
- Use Artisan commands for code generation (controllers, models, migrations)
- Always use dependency injection in controllers
- Use service providers for application bootstrapping
- Organize business logic in service classes, not controllers

## Eloquent ORM
- Always use Eloquent models for database interactions
- Use migrations for all database schema changes
- Always define relationships in model classes
- Use query scopes for reusable query logic
- Never use raw queries unless absolutely necessary

## Controllers & Routes
- Keep controllers thin - delegate to services or models
- Always use route model binding when possible
- Use form request classes for validation logic
- Always return appropriate HTTP status codes
- Use resource controllers for RESTful operations

## Validation & Security
- Always use Laravel's validation system
- Use form request classes for complex validation rules
- Never trust user input - validate everything
- Always use Laravel's built-in CSRF protection
- Use Laravel Sanctum or Passport for API authentication

## Database
- Always use migrations for database changes
- Use seeders for sample data generation
- Always add proper indexes for performance
- Use database transactions for multi-step operations
- Use Laravel's query builder for complex queries

## Testing
- Always write tests using PHPUnit with Laravel's testing helpers
- Use factories for test data generation
- Test both feature behavior and unit logic
- Always mock external dependencies
- Use database transactions in tests for cleanup