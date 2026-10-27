# Reflite Technologies

Company website and staff inbox built with TanStack Start, React, TypeScript, Tailwind CSS, and Supabase.

## Development

Requirements: Node.js and npm.

```sh
npm install
npm run dev
```

Copy `.env.example` to `.env` and set credentials for your Supabase project, OpenAI API account, and Google Gmail integration. Configure Google as an OAuth provider in Supabase for staff sign-in. Gmail inbox sync and sending use a Google OAuth refresh token with Gmail API access; the Supabase Google sign-in setup is separate.

Run `npm run lint` and `npm run build` to validate changes.
