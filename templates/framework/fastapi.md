# FastAPI Rules

*Based on FastAPI 0.104+ (October 2023)*

## API Design
- Always use Pydantic models for request/response validation
- Use proper HTTP status codes for all endpoints
- Always implement proper error handling with HTTPException
- Use dependency injection for shared logic (auth, database)
- Always version your APIs with router prefixes

## Type Safety
- Always use type hints for all function parameters and returns
- Use Pydantic BaseModel for all data structures
- Always validate request data with Pydantic models
- Use Enum classes for predefined choices
- Never use `Any` type - use specific types or unions

## Authentication & Security
- Always implement proper authentication (JWT, OAuth2)
- Use dependency injection for authentication checks
- Always validate and sanitize user inputs
- Use HTTPS in production with proper SSL configuration
- Implement rate limiting for all public endpoints

## Database Integration
- Always use async database drivers (asyncpg, aiomysql)
- Use SQLAlchemy with async support for ORM
- Always use database connection pools
- Implement proper database session management
- Always use database migrations for schema changes

## Performance
- Always use async/await for I/O operations
- Use background tasks for non-blocking operations
- Implement proper caching strategies
- Use compression middleware for large responses
- Monitor performance with proper logging and metrics

## Testing
- Use pytest with pytest-asyncio for async testing
- Always test API endpoints with TestClient
- Mock external dependencies (databases, APIs)
- Test authentication and authorization flows
- Use factories for test data generation