# Testing Guide

This project uses **Vitest** with **React Testing Library** for testing Next.js applications.

## Commands

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:ui       # Run tests in a UI
npm run test:coverage # Generate coverage
```

## Writing Tests

### API Routes
```typescript
/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findMany: vi.fn() } }
}))

describe('/api/users', () => {
  it('should return users', async () => {
    // Test implementation
  })
})
```

### Components
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Common Mocks

### Database
```typescript
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findMany: vi.fn(), create: vi.fn(), update: vi.fn() }
  }
}))
```

### Authentication
```typescript
vi.mock('next-auth/react', () => ({
  useSession: () => ({
    data: { user: { id: '1', role: 'USER' } },
    status: 'authenticated'
  })
}))
```

## Test Helpers

Available in `test/helpers/api-test-helpers.ts`:
- `createMockRequest()` - Mock NextRequest
- `mockAuthenticatedUser()` - Mock user session
- `parseResponse()` - Parse API responses

## Debugging

```typescript
screen.debug() // Print DOM
expect(mockFn).toHaveBeenCalledWith(args) // Check calls
```

## Files Structure
- `test/setup.ts` - Global setup
- `test/helpers/` - Test utilities  
- `test/fixtures/` - Mock data
- `**/*.test.{ts,tsx}` - Test files