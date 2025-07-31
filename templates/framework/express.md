# Express.js Rules

*Based on Express.js 4.18+ (April 2022)*

## Middleware
- Order middleware correctly (security, parsing, routes, error handling)
- Create reusable middleware functions for common tasks
- Always use error-handling middleware as the last middleware
- Use built-in express.json() and express.urlencoded() for parsing
- Implement request logging and monitoring middleware

## Routing
- Use express.Router() to organize routes into separate modules
- Follow RESTful conventions for API endpoints
- Use appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
- Implement API versioning (e.g., /api/v1/)
- Validate route parameters and query strings

## Security
- Always use helmet.js for security headers
- Implement CORS configuration appropriately
- Use express-rate-limit to prevent abuse
- Validate all user inputs with express-validator
- Never trust user input - sanitize and validate everything

## Error Handling
- Use async error handling middleware
- Create consistent error response format
- Log errors but don't expose internal details to clients
- Handle different error types appropriately
- Implement proper 404 handling for unknown routes

## API Design
- Use consistent response format for all endpoints
- Implement proper HTTP status codes
- Provide meaningful error messages
- Use JSON for request and response bodies
- Document all endpoints with clear descriptions

## Performance
- Use compression middleware for response compression  
- Implement caching headers for static content
- Use connection pooling for database connections
- Enable HTTP keep-alive connections
- Monitor response times and optimize slow endpoints