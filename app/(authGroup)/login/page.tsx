import { Suspense } from "react";
import LoginForm from "../_components/LoginForm";

export const metadata = {
  title: "Login | FixItNow",
  description: "Login to your FixItNow account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense fallback={<div>Loading...</div>}></Suspense>
      <LoginForm />
    </div>
  );
}
