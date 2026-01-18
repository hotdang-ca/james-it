# James-It Platform

A modern, full-stack Personal Concierge platform connecting the service provider (James) with customers through real-time updates, secure communication, and live tracking.

## 🚀 Features

### For the Admin (James)
*   **CRM Dashboard**: Centralized view of all service inquiries and contacts.
*   **Job Management**: Convert inquiries into Jobs with status tracking (`PENDING`, `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).
*   **Active Jobs Command Center**:
    *   **Live Location Broadcasting**: Share real-time GPS location with the customer during active jobs.
    *   **Integrated Chat**: Communicate instantly with customers directly from the tracking dashboard.
*   **Payments**: Generate unique Stripe payment links for deposits.

### For the Customer
*   **Magic Link Portal**: Secure, password-less access via unique Job UUIDs.
*   **Live Status**: Real-time view of job status and details.
*   **Interactive Map**: Watch James's location in real-time on a map when the job is in progress.
*   **Direct Chat**: Instant messaging with James for updates or questions.
*   **Payment**: One-click access to pay deposits via Stripe.

## 🛠 Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
*   **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, RLS, Realtime)
*   **Styling**: CSS Modules (Clean, responsive design)
*   **Maps**: [Leaflet](https://leafletjs.com/) / React-Leaflet
*   **Testing**: Vitest & React Testing Library

## 📦 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/hotdang-ca/james-it.git
    cd james-it
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file with your Supabase credentials:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    STRIPE_SECRET_KEY=your_stripe_key_or_mock
    ```

4.  **Database Setup**
    Run the SQL scripts located in `supabase/schema.sql` (if you extracted them) or ensure your Supabase project has the following tables:
    *   `contacts`
    *   `jobs`
    *   `messages`
    *   `geolocation_logs`
    
    *Note: Ensure Realtime is enabled for `messages` and `geolocation_logs`.*

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🔒 Security

*   **RLS (Row Level Security)** is enforced on all tables.
*   **Secure RPCs**: Customer data access is strictly controlled via `SECURITY DEFINER` functions, ensuring users can only access data related to their specific Job UUID.
