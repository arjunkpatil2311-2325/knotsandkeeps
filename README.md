# Knots and Keeps

A premium, full-stack e-commerce platform for handmade bracelets. Built with Next.js, Tailwind CSS, and Supabase.

## Features Built
- **Customer Storefront:** Responsive Home page, Shop catalog, and Product detail pages.
- **Admin Panel:** Protected dashboard to manage products.
- **Product Management:** Create products, upload images (Supabase Storage), manage stock, and auto-calculate discounts.
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) and Supabase Auth.

## Setup Instructions

### 1. Install Dependencies
Make sure you are in the project root:
```bash
npm install
```

### 2. Configure Supabase
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase-schema.sql` (found in the root folder) and run it. This will create the tables, RLS policies, and storage buckets.
4. Optional: Run `seed-demo.sql` to populate some demo products.

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Anon public key)
- `ADMIN_EMAIL` (Set this to the email you will use for your admin account)

### 4. Create your Admin Account
1. Start the local server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:3000/login`
3. Enter your email and a password, and click **Sign Up**.
4. Important: If your email matches the `ADMIN_EMAIL` in `.env.local`, you will have access to the `/admin` routes.
5. In your Supabase SQL Editor, run this quick command to give yourself full admin database rights:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

### 5. Managing Products & Images
1. Log in to `http://localhost:3000/admin`
2. Go to **Products -> Create Product**.
3. Fill out the details, upload images, set stock, and hit **Save Product**.
4. Visit `http://localhost:3000/shop` to see your live product!

## Production Deployment
You can deploy this directly to Vercel. Ensure you add the environment variables in your Vercel project settings before deploying.
