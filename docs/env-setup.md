# Environment Variables Setup

Copy these into `.env.local` at the project root and fill in your real values.

```
NEXT_PUBLIC_SUPABASE_URL=https://wwbojuwmkfaiyktcjdds.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ym9qdXdta2ZhaXlrdGNqZGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNDM2NjMsImV4cCI6MjA5NzcxOTY2M30.OyY_DS56Qlez4YZ2AOLhUfT9D4QMxkPzGWCkXaKOsc4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3Ym9qdXdta2ZhaXlrdGNqZGRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE0MzY2MywiZXhwIjoyMDk3NzE5NjYzfQ.iCdBafxU0yhmac6hCtXMKETllDo7sGPaIT4wP1-qGTE
SEMRUSH_API_KEY=your-semrush-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## Where to find each value

**Supabase** — create a free project at https://supabase.com
- Go to Project Settings → API
- Copy: Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Copy: anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy: service_role key → `SUPABASE_SERVICE_ROLE_KEY`

**SEMrush** — https://www.semrush.com/api-analytics/
- Go to your SEMrush account → Subscription → API

**Anthropic** — https://console.anthropic.com/settings/keys
- Create a new API key

## Note
`.env.local` is already created at the project root (it may be hidden in your IDE — enable "Show Hidden Files" to see it).
Next.js reads `.env.local` automatically. Do NOT commit it to git.
