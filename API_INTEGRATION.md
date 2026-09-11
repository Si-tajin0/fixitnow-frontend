# 🔧 FixItNow - API Integration Documentation

Welcome to the API Integration guide for the **FixItNow** Frontend Application. This document maps out how the Next.js (App Router) frontend components and Server Actions consume the backend endpoints.

## 🚀 Base URL & Architecture

- **Base API URL:** `https://fixitnow-backend-assignment4.vercel.app`
- **Integration Pattern:** **BFF (Backend For Frontend)**.
- **Mechanism:** The frontend uses Next.js **Server Actions** combined with a centralized `apiFetcher.ts` proxy to securely attach the JWT `accessToken` (stored in HTTP-Only cookies) before communicating with the external backend API. This solves CORS issues and keeps credentials hidden from the browser.

---

## 🔐 1. Authentication & User Management

| Method    | Endpoint                | Frontend Action                                                       | Frontend Component / Feature                                                                       |
| :-------- | :---------------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| **POST**  | `/auth/register`        | `registerUserAction`                                                  | `app/(authGroup)/_components/RegisterForm.tsx` (Handles both Customer and Technician registration) |
| **POST**  | `/auth/login`           | `loginUserAction`                                                     | `app/(authGroup)/_components/LoginForm.tsx` (Validates user status and logs in)                    |
| **GET**   | `/auth/me`              | `getCurrentUser`, `getCustomerProfileAction`, `getAdminProfileAction` | `app/layout.tsx` (Role-based Navbar routing) & Profile settings                                    |
| **PATCH** | `/users/update-profile` | `updateCustomerProfileAction`, `updateAdminProfileAction`             | `app/(dashboardGroup)/dashboard/customer/profile/page.tsx` & Admin profile                         |

---

## 🛠️ 2. Services & Categories

| Method   | Endpoint            | Frontend Action              | Frontend Component / Feature                                                                              |
| :------- | :------------------ | :--------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **GET**  | `/categories`       | `getCategoriesAction`        | `app/(publicGroup)/services/page.tsx` (Public filter dropdown)                                            |
| **POST** | `/admin/categories` | `createCategoryAction`       | `app/(dashboardGroup)/dashboard/admin/categories/page.tsx` (Admin creates categories)                     |
| **GET**  | `/services`         | `getAllPublicServicesAction` | `app/(publicGroup)/services/page.tsx` (Public grid with Search & Filter by category/price)                |
| **GET**  | `/services/:id`     | `getSingleServiceAction`     | `app/book/[id]/page.tsx` (Fetches details for booking)                                                    |
| **POST** | `/services`         | `createServiceAction`        | `app/(dashboardGroup)/dashboard/technician/services/page.tsx` (Technician creates their specific service) |

---

## 🧑‍🔧 3. Technician Profiles

| Method  | Endpoint              | Frontend Action                 | Frontend Component / Feature                                                                                               |
| :------ | :-------------------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------------------- |
| **GET** | `/technicians`        | `getAllPublicTechniciansAction` | `app/(publicGroup)/services/page.tsx` (Shows live pricing & availability of technicians)                                   |
| **GET** | `/technicians/:id`    | `getPublicTechnicianByIdAction` | `app/(publicGroup)/technicians/[id]/page.tsx` (Public profile view with bio & reviews)                                     |
| **PUT** | `/technician/profile` | `updateTechnicianProfileAction` | `app/(dashboardGroup)/dashboard/technician/profile/page.tsx` (Technician updates skills, pricing, and availability toggle) |

---

## 📅 4. Booking Flow

| Method    | Endpoint                   | Frontend Action             | Frontend Component / Feature                                                                                             |
| :-------- | :------------------------- | :-------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **POST**  | `/bookings`                | `createBookingAction`       | `app/book/[id]/page.tsx` (Customer creates a booking with date & time)                                                   |
| **GET**   | `/bookings`                | `getMyBookingsAction`       | `app/(dashboardGroup)/dashboard/customer/page.tsx` (Customer booking history table)                                      |
| **PATCH** | `/bookings/:id`            | `cancelBookingAction`       | `app/(dashboardGroup)/dashboard/customer/page.tsx` (Customer cancels `REQUESTED` booking)                                |
| **PATCH** | `/technician/bookings/:id` | `updateBookingStatusAction` | `app/(dashboardGroup)/dashboard/technician/page.tsx` (Technician updates status: `ACCEPTED`, `IN_PROGRESS`, `COMPLETED`) |

---

## 💳 5. Stripe Payment Gateway

| Method   | Endpoint            | Frontend Action        | Frontend Component / Feature                                                                                   |
| :------- | :------------------ | :--------------------- | :------------------------------------------------------------------------------------------------------------- |
| **POST** | `/payments/create`  | `createPaymentAction`  | `app/(dashboardGroup)/dashboard/customer/page.tsx` (Initiates Stripe Checkout session for `ACCEPTED` bookings) |
| **POST** | `/payments/confirm` | `confirmPaymentAction` | `app/payment-success/page.tsx` (Verifies the `transactionId` from Stripe URL and updates status to `PAID`)     |

---

## ⭐ 6. Review System

| Method   | Endpoint   | Frontend Action              | Frontend Component / Feature                                                                                       |
| :------- | :--------- | :--------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **POST** | `/reviews` | `createReviewAction`         | `app/(dashboardGroup)/dashboard/customer/page.tsx` (Customer leaves a review for `COMPLETED` jobs via Modal)       |
| **GET**  | `/reviews` | `getTechnicianReviewsAction` | `app/(publicGroup)/technicians/[id]/page.tsx` (Fetches and filters reviews to show on Technician's public profile) |

---

## 👑 7. Admin Control Panel

| Method    | Endpoint           | Frontend Action          | Frontend Component / Feature                                                                                         |
| :-------- | :----------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **GET**   | `/admin/users`     | `getAllUsersAction`      | `app/(dashboardGroup)/dashboard/admin/users/page.tsx` (Admin views all registered users)                             |
| **PATCH** | `/admin/users/:id` | `updateUserStatusAction` | `app/(dashboardGroup)/dashboard/admin/users/page.tsx` (Admin Bans/Unbans users via `ACTIVE`/`BLOCKED` status toggle) |

---

_Built with ❤️ using Next.js 15, React Query, and Tailwind CSS._
