// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to FixItNow! 🔧</h1>
      <Link href="/login" className="text-blue-600 hover:underline text-lg">
        Go to Login Page 👉
      </Link>
    </div>
  );
}
