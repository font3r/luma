---
name: typescript
description: TypeScript development best practices, patterns, and tooling. Use when writing, reviewing, or debugging TypeScript code.
---

# TypeScript Development Guidelines

## Type Safety

- Prefer `type` over `interface` for unions, primitives, and utility types
- Use `interface` for object shapes that may be extended
- Never use `any` - use `unknown` when type is truly unknown
- Enable `strict: true` in tsconfig
- Use type guards: `typeof`, `instanceof`, custom predicates

## Common Patterns

### Utility Types
```typescript
// Pick and Omit
type Props = { a: string; b: number; c: boolean };
type ABProps = Pick<Props, 'a' | 'b'>;
type WithoutB = Omit<Props, 'b'>;

// Partial and Required
type Optional = Partial<Props>;
type RequiredProps = Required<Props>;

// Record for object maps
type UserMap = Record<string, User>;
```

### Generics
```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Constraint generics
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length > b.length ? a : b;
}
```

### Error Handling
```typescript
// Result type pattern
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function safeParse<T>(json: string): Result<T> {
  try {
    return { ok: true, value: JSON.parse(json) };
  } catch (e) {
    return { ok: false, error: e as Error };
  }
}
```

## React + TypeScript

```typescript
// Props with children
type Props = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
};

// Event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
};
```

## Import Organization

1. External libraries (react, lodash)
2. Internal modules (@/, ../)
3. Type imports (import type)
4. Relative imports (./)

```typescript
import { useState, useEffect } from 'react';
import { getUser } from '@/api/users';
import type { User } from '@/types';
import { Button } from './Button';
```

## tsconfig Essentials

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

## Commands

- `npx tsc --noEmit` - Type check without emitting
- `npx tsc --noEmit --watch` - Watch mode
- `npx tsc --traceResolution` - Debug import resolution

## When to Use This Skill

- Writing new TypeScript code
- Reviewing TypeScript PRs
- Debugging type errors
- Setting up tsconfig
- Converting JavaScript to TypeScript
