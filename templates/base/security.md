# Security Best Practices

## Input Validation
- Validate all inputs at system boundaries
- Use allowlists over blocklists
- Sanitize data before processing
- Set reasonable limits on input sizes
- Validate data types and formats

## Authentication & Authorization
- Use strong authentication methods
- Hash passwords with salt (bcrypt, scrypt, Argon2)
- Implement proper session management
- Follow principle of least privilege
- Use secure tokens with expiration

## Data Protection
- Encrypt sensitive data at rest and in transit
- Use secure protocols (TLS 1.3+)
- Implement proper key management
- Follow data minimization principles
- Secure deletion of sensitive data

## Common Vulnerabilities
- **SQL Injection**: Use parameterized queries
- **XSS**: Escape output, validate input
- **CSRF**: Use tokens and verify origins
- **Path Traversal**: Validate file paths
- **Insecure Deserialization**: Validate serialized data

## Secure Error Handling
- Never expose internal details or stack traces in error responses
- Log security events but never log passwords or sensitive data
- Provide generic error messages to users (avoid revealing system info)
- Implement proper error boundaries to prevent information leakage
- Use structured logging for security monitoring

## Dependencies
- Keep dependencies updated
- Use security scanning tools
- Minimize dependency count
- Verify package integrity
- Monitor for vulnerabilities

## Configuration
- Store secrets in environment variables
- Separate configs per environment
- Use secure defaults
- Implement secrets management
- Validate configuration on startup