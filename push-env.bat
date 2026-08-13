@echo off
<nul set /p="https://eluwshbmukfxhwrgqdfk.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
<nul set /p="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsdXdzaGJtdWtmeGh3cmdxZGZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0MjUyMDcsImV4cCI6MjEwMjAwMTIwN30.f8GBybplYv923CISLmpfENt-hfPxP_EQAyRfQlob7BA" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
<nul set /p="arjun.kpatil2311@gmail.com" | npx vercel env add ADMIN_EMAIL production
npx vercel deploy --prod --yes
