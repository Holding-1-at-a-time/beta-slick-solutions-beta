# Clerk Integration with Next.js

This project demonstrates a complete integration of Clerk authentication and organization management with Next.js App Router.

## Getting Started

1. Clone this repository
2. Copy `.env.local.example` to `.env.local` and add your Clerk API keys
3. Install dependencies: `npm install` or `yarn install` or `pnpm install`
4. Run the development server: `npm run dev` or `yarn dev` or `pnpm dev`

## Environment Variables

You need to set up the following environment variables in your `.env.local` file:

\`\`\`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-publishable-key
CLERK_SECRET_KEY=sk_test_your-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

You can get your Clerk API keys from the [Clerk Dashboard](https://dashboard.clerk.dev/).

## Features

- User authentication (sign in, sign up, sign out)
- Organization management (create, switch, manage members)
- Protected routes with middleware
- User profile management
- Session management
- Role-based access control

## Deployment

This project can be deployed on Vercel. Make sure to set the environment variables in your Vercel project settings.
