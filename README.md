# St Michael Car Rentals — Full-Stack Web Application

A complete, production-ready car rental platform built with React, TypeScript, Tailwind CSS, and Supabase.

---

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (admin dashboard)
- **Icons**: Lucide React
- **Dates**: date-fns
- **Toasts**: react-hot-toast

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd st-michael-car-rentals
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In your Supabase project, go to **SQL Editor**.
3. Run the SQL files in this order:
   - `schema.sql` — Creates all tables and triggers
   - `rls.sql` — Enables Row Level Security with all policies
   - `seed.sql` — Inserts sample vehicles, settings, and promo codes

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in: Supabase Dashboard → Project Settings → API → Project URL and anon key.

### 4. Create an Admin User

1. Run the app (`npm run dev`)
2. Register a new account via `/register`
3. In Supabase SQL Editor, run:

```sql
UPDATE public.users SET role = 'super_admin' WHERE email = 'your@email.com';
```

4. Now log in at `/admin/login` with that account.

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Routes

### Public
| Route | Description |
|-------|-------------|
| `/` | Home page with hero, booking widget, featured vehicles |
| `/cars` | Vehicle catalog with filtering and sorting |
| `/cars/:id` | Vehicle detail page with specs, reviews, booking CTA |
| `/booking/:vehicleId` | 6-step booking flow |
| `/booking/confirmation/:ref` | Booking confirmation page |
| `/services` | Services overview |
| `/about` | About the company |
| `/faq` | Searchable FAQ accordion |
| `/contact` | Contact form and info |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |
| `/cancellation` | Cancellation Policy |
| `/rental-policy` | Rental Policy |

### Customer Account (protected)
| Route | Description |
|-------|-------------|
| `/login` | Customer login |
| `/register` | Customer registration |
| `/account` | Account overview with stats |
| `/account/bookings` | View and cancel bookings |
| `/account/profile` | Edit profile |
| `/account/reviews` | Leave and view reviews |

### Admin (role-protected)
| Route | Description |
|-------|-------------|
| `/admin/login` | Admin login |
| `/admin` | Dashboard with charts and stats |
| `/admin/bookings` | All bookings with search and filter |
| `/admin/bookings/:id` | Booking detail with status actions |
| `/admin/vehicles` | Vehicle management |
| `/admin/vehicles/new` | Add new vehicle |
| `/admin/vehicles/:id/edit` | Edit vehicle |
| `/admin/customers` | Customer list with spend data |
| `/admin/calendar` | Monthly booking calendar |
| `/admin/reviews` | Review management |
| `/admin/promo-codes` | Promo code management |
| `/admin/settings` | Site settings |
| `/admin/notifications` | In-app notifications |

---

## Deployment

### Deploy to Vercel (recommended)

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com), import your repository.
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Done.

### Build for Production

```bash
npm run build
```

The output is in the `dist/` folder — deploy to any static hosting (Netlify, Cloudflare Pages, etc.).

---

## Supabase Storage (Vehicle Images)

To upload real vehicle images:

1. In Supabase Dashboard, go to **Storage** and create a bucket named `vehicles` (set to public).
2. Upload images there and use the public URLs in the vehicle form.
3. Alternatively, use Unsplash URLs directly in the vehicle image fields.

---

## Features

- Full Supabase auth (customer + admin flows)
- Role-based access control (customer / admin / super_admin)
- Row Level Security on all tables
- 6-step booking flow with extras, promo codes, and price calculation
- Double-booking prevention (checks date conflicts before confirming)
- Admin dashboard with Recharts visualizations
- Booking calendar view
- Promo code system (percentage & fixed, with expiry and usage limits)
- Customer reviews with star ratings
- WhatsApp float button (number from site_settings)
- Mobile-first responsive design at 360px, 768px, 1024px, 1440px
- Skeleton loaders on all async data
- Toast notifications on all actions
- SEO meta tags on all pages
- Accessible: keyboard navigation, ARIA labels, focus states

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous (public) key |

**Never expose your Supabase service role key in the frontend.**

---

## License

Built for St Michael Car Rentals, Ghana. All rights reserved.
