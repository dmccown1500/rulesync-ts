# Next.js Rules

*Based on Next.js 14+ (October 2023)*

## App Router
- Always use App Router (app directory) for new projects
- Use Server Components by default, Client Components only when needed
- Mark Client Components with "use client" directive at the top
- Place layout.tsx files in route segments for shared layouts
- Use loading.tsx, error.tsx, and not-found.tsx for UI states

## Routing & Navigation
- Always use file-based routing in the app directory
- Use dynamic routes with [param] syntax for dynamic segments
- Always use Next.js Link component for internal navigation
- Use useRouter hook only in Client Components
- Implement parallel routes with @folder syntax when needed

## Data Fetching
- Use async Server Components for data fetching by default
- Use fetch() with Next.js caching extensions in Server Components
- Always implement proper error boundaries for data fetching
- Use React Query/SWR only for client-side data fetching needs
- Cache data appropriately with revalidate options

## Performance
- Always use Next.js Image component for all images
- Implement lazy loading for below-the-fold content
- Use dynamic imports for code splitting heavy components
- Always optimize fonts with next/font
- Enable experimental features like PPR when stable

## SEO & Metadata
- Always use generateMetadata function for dynamic metadata
- Implement proper Open Graph and Twitter Card metadata
- Use structured data (JSON-LD) for rich search results
- Always provide alt text for images
- Implement proper canonical URLs for duplicate content

## API Routes
- Use Route Handlers (route.ts) in app directory
- Always validate request data with proper schemas
- Implement proper error handling with appropriate HTTP status codes
- Use middleware for cross-cutting concerns (auth, logging)
- Never expose sensitive data in API responses