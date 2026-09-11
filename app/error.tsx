"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 bg-gray-50 px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-red-500" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Uh oh! Something went wrong.
        </h2>
        <p className="text-gray-500">
          We apologize, but an unexpected error occurred.
        </p>
      </div>
      <Button
        onClick={() => reset()}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full cursor-pointer"
      >
        Try again
      </Button>
    </div>
  );
}
