# Ruby on Rails Rules

*Based on Rails 7.1+ (October 2023)*

## MVC Architecture
- Always follow Rails MVC conventions strictly
- Keep controllers thin - move business logic to models or services
- Use concerns for shared model and controller behavior
- Always use strong parameters for mass assignment protection
- Never put business logic in views - use helpers or decorators

## Models & Database
- Always use Rails migrations for database schema changes
- Use ActiveRecord validations for data integrity
- Always add database indexes for frequently queried columns
- Use scopes for reusable query logic
- Never use raw SQL unless absolutely necessary

## Controllers
- Always use RESTful routes and actions
- Use `before_action` filters for common controller logic
- Always handle exceptions with proper error responses
- Use strong parameters to whitelist allowed attributes
- Keep actions focused on HTTP request/response handling

## Views & Templates
- Always use Rails helpers for view logic
- Use partials to avoid code duplication in views
- Always escape user input to prevent XSS attacks
- Use Rails form helpers for consistent form handling
- Implement proper CSRF protection on all forms

## Security
- Always use Rails' built-in security features
- Never trust user input - validate and sanitize everything
- Always use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use Rails' built-in CSRF protection

## Testing
- Always write tests using RSpec or Minitest
- Use factory_bot for test data generation
- Test models, controllers, and integration scenarios
- Always mock external dependencies
- Maintain high test coverage on critical business logic