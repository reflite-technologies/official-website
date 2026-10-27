# Reflite Technologies

## Project conventions

- Use npm for dependency management and run `npm run lint` and `npm run build` before completing substantial changes.
- Keep Supabase credentials in environment variables; never expose the service-role key to client code.
- Server-only integrations belong in `*.server.ts` modules.
