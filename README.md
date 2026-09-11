# 🛠️ FixItNow - Frontend Application

> **Your Trusted Home Service Platform**
> A modern, responsive, and full-stack home service marketplace where customers can find and book top-rated technicians, and technicians can manage their service gigs seamlessly.

🔗 **Live URL:** [(https://fixitnow-frontend-rose.vercel.app/)]
🔗 **Backend API URL:** [(https://fixitnow-backend-assignment4.vercel.app)]

---

## 🚀 Tech Stack Used

This project is built with the latest industry standards and modern web technologies:

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode, 100% Type-Safe)
- **Styling:** Tailwind CSS v4 & Shadcn UI
- **Data Fetching & State:** TanStack React Query & Next.js Server Actions
- **Forms & Validation:** React Hook Form & Zod
- **Payment Gateway:** Stripe Checkout Integration
- **Icons & UI:** Lucide React, React Hot Toast

---

## 🌟 Key Features

### 👤 1. Customer Features

- **Browse & Filter:** Real-time search and filter services by category, price range, and technician skills.
- **Dynamic Booking:** Select preferred Date (Shadcn Calendar) and Time slots to book a service.
- **Secure Payment:** Pay for accepted bookings using **Stripe Payment Gateway** with dynamic success/cancel redirects.
- **Review System:** Leave a 1-5 star rating and feedback for completed jobs.
- **Dashboard:** Track booking statuses (`REQUESTED`, `ACCEPTED`, `PAID`, `COMPLETED`, `CANCELLED`).

### 🧑‍🔧 2. Technician Features

- **Service Management:** Create specific service gigs based on Admin categories.
- **Profile & Availability:** Manage skills, base pricing, experience, and toggle real-time availability.
- **Job Requests:** Accept or Decline incoming service requests from customers.
- **Job Status Tracking:** Mark jobs as `IN_PROGRESS` and `COMPLETED`.

### 👑 3. Admin Features

- **User Management:** View all registered users and **Ban/Unban (Block/Active)** users directly from the dashboard.
- **Category Management:** Create and manage global service categories for technicians to use.
- **Platform Monitoring:** Read-only access to all services active on the platform.

---

## 🛡️ Security & Architecture (BFF Pattern)

- **Backend For Frontend (BFF):** We used a centralized proxy (`apiFetcher.ts`) combined with **Next.js Server Actions**. This prevents CORS issues and hides backend APIs from the browser's network tab.
- **JWT Middleware:** Role-based route protection (`/dashboard/*` and `/book/*`) using `middleware.ts` to ensure only authorized users access specific pages. Banned users are strictly kicked out during the login action.
- **Error Handling:** Implemented global `<Toaster/>`, customized 404 Not Found pages, and Zod schema validations for robust error boundaries.

---

## ⚙️ Getting Started (Local Setup)

To run this project locally, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fixitnow-frontend.git
cd fixitnow-frontend
2. Install dependencies
(We recommend using pnpm for faster installation)
code
Bash
pnpm install
3. Setup Environment Variables
Create a .env.local file in the root directory and add your backend API URL:
code
Env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
4. Run the development server
code
Bash
pnpm dev
Open http://localhost:3000 with your browser to see the result.
Developed with ❤️ as part of the Final Frontend Assignment.
```
