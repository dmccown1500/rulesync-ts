# Node.js Rules

*Based on Node.js 20+ LTS (October 2023)*

## Application Structure
- Use MVC or layered architecture pattern
- Separate routes, controllers, services, and models
- Create reusable middleware functions
- Organize files by feature, not by type
- Use barrel exports (index.js) for clean imports

## Async/Await
- Always use async/await over callbacks or raw Promises
- Handle all async errors with try/catch blocks
- Never use synchronous file system operations in production
- Use Promise.all() for parallel async operations
- Implement proper timeout handling for external calls

## Error Handling
- Create custom error classes for different error types
- Use centralized error handling middleware
- Never expose internal error details to clients
- Log errors with appropriate context and stack traces
- Implement graceful shutdown handling

## Security
- Always validate and sanitize user inputs
- Use helmet.js for security headers
- Implement rate limiting on all public endpoints
- Never log sensitive information (passwords, tokens)
- Use environment variables for all secrets and configuration

## Performance
- Use connection pooling for databases
- Implement caching strategies (Redis, in-memory)
- Use clustering for multi-core utilization
- Enable gzip compression
- Monitor memory usage and prevent leaks

## Dependencies
- Keep dependencies minimal and up-to-date
- Use exact versions in package.json for production
- Audit dependencies regularly for vulnerabilities
- Separate development and production dependencies
- Use package-lock.json for consistent installs