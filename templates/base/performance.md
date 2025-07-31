# Performance Best Practices

## Measurement First
- Profile before optimizing
- Set performance budgets
- Monitor key metrics
- Use appropriate benchmarking tools
- Measure real-world scenarios

## Algorithm Optimization
- Choose appropriate data structures
- Optimize time complexity (prefer O(1), O(log n))
- Cache expensive computations
- Implement lazy loading
- Avoid unnecessary iterations

## Memory Management
- Minimize allocations in hot paths
- Reuse objects when possible
- Clean up resources properly
- Monitor memory usage
- Use appropriate collection sizes

## I/O Optimization
- Minimize network requests
- Use compression
- Implement caching strategies
- Batch operations when possible
- Use async/non-blocking operations

## Database Performance
- Use indexes effectively
- Optimize queries (avoid N+1)
- Implement connection pooling
- Use appropriate batch sizes
- Cache frequently accessed data

## Concurrency
- Use thread pools over raw threads
- Implement proper synchronization
- Avoid blocking operations
- Use lock-free data structures when appropriate
- Monitor contention and deadlocks