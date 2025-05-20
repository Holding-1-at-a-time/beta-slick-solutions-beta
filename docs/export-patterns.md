# Export Patterns Guide

This document outlines the export patterns used in our project to ensure consistency and prevent issues with component imports.

## Component Export Patterns

All components should have **both named and default exports**:

\`\`\`tsx
// Good - has both named and default exports
export function MyComponent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export default MyComponent;
\`\`\`

This approach allows components to be imported in either of these ways:

\`\`\`tsx
// Both of these import styles will work
import { MyComponent } from "@/components/MyComponent";
// or
import MyComponent from "@/components/MyComponent";
\`\`\`

## Special Cases

### Next.js Pages and Layouts

Next.js pages, layouts, loading, and error components should use default exports as required by the framework:

\`\`\`tsx
// app/page.tsx
export default function Page() {
  return <div>Page content</div>;
}
\`\`\`

### Utility Functions

Utility functions should use named exports:

\`\`\`tsx
// utils/date.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
\`\`\`

## Checking and Fixing Export Patterns

We have scripts to check and fix export patterns:

\`\`\`bash
# Check for components with incorrect export patterns
npm run lint:exports

# Automatically fix components with incorrect export patterns
npm run fix:exports
\`\`\`

## ESLint Rules

Our ESLint configuration enforces these export patterns. You can run the linter to check for issues:

\`\`\`bash
npm run lint
\`\`\`

## Why Both Export Types?

Using both named and default exports provides flexibility and prevents import errors:

1. **Consistency**: All components can be imported the same way
2. **Autocomplete**: Named imports work better with IDE autocomplete
3. **Tree-shaking**: Named imports can be better optimized
4. **Compatibility**: Some libraries or tools might expect one or the other

## Questions?

If you have questions about these patterns, please reach out to the team lead.
