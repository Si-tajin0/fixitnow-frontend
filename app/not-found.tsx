import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-md">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-800">
          Oops! Page Not Found 🛠️
        </h2>
        <p className="text-gray-600 max-w-md mx-auto text-lg">
          Looks like this page is missing, just like a lost wrench! Don&apos;t
          worry, let&apos;s get you back to safety.
        </p>

        <div className="pt-6">
          <Link href="/">
            <Button
              size="lg"
              className="px-8 py-6 text-lg rounded-full cursor-pointer"
            >
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
