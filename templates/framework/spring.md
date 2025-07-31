# Spring Boot Rules

*Based on Spring Boot 3.2+ (November 2023)*

## Application Structure
- Always use Spring Boot over plain Spring for new projects
- Use `@SpringBootApplication` annotation on main application class
- Organize code in packages by feature, not by layer
- Always use dependency injection with `@Autowired` or constructor injection
- Use configuration classes with `@Configuration` for bean definitions

## REST API Design
- Always use `@RestController` for REST endpoints
- Use proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Always validate request data with `@Valid` and Bean Validation
- Use `@RequestBody` for JSON payloads, `@RequestParam` for query params
- Return `ResponseEntity` for fine-grained response control

## Data Access
- Always use Spring Data JPA for database operations
- Use Repository interfaces extending JpaRepository
- Always implement proper transaction management with `@Transactional`
- Use `@Query` annotations for custom queries
- Always implement proper database connection pooling

## Security
- Always use Spring Security for authentication and authorization
- Implement JWT authentication for stateless APIs
- Use `@PreAuthorize` and `@PostAuthorize` for method-level security
- Always validate and sanitize user inputs
- Never expose sensitive data in API responses

## Configuration
- Always use `application.yml` over `application.properties`
- Use profiles for environment-specific configurations
- Always externalize configuration with `@ConfigurationProperties`
- Use Spring Boot Actuator for monitoring and health checks
- Never hardcode secrets - use environment variables

## Testing
- Use `@SpringBootTest` for integration tests
- Use `@WebMvcTest` for testing web layer only
- Always mock external dependencies with `@MockBean`
- Use TestContainers for database integration tests
- Test both successful and error scenarios