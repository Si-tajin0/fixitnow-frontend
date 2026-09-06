"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { confirmPaymentAction } from "@/service/paymentActions";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"verifying" | "success" | "failed">(
    "verifying",
  );
  const [message, setMessage] = useState("Processing your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId =
        searchParams.get("transactionId") || searchParams.get("session_id");

      if (!transactionId) {
        setStatus("success");
        setMessage(
          "Payment Successful! Your booking status will be updated shortly.",
        );
        return;
      }

      const result = await confirmPaymentAction(transactionId);

      if (result.success || result.message.toLowerCase().includes("already")) {
        setStatus("success");
        setMessage(
          "Your payment is successfully verified and booking is PAID!",
        );
      } else {
        setStatus("failed");
        setMessage(result.message);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <Card
      className={`max-w-md w-full shadow-lg border-t-4 text-center py-8 ${status === "success" ? "border-t-green-500" : status === "failed" ? "border-t-red-500" : "border-t-blue-500"}`}
    >
      <CardHeader>
        <div className="flex justify-center mb-4">
          {status === "verifying" && (
            <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-20 h-20 text-green-500" />
          )}
          {status === "failed" && (
            <AlertCircle className="w-20 h-20 text-red-500" />
          )}
        </div>
        <CardTitle className="text-3xl font-bold text-gray-800">
          {status === "verifying" && "Processing..."}
          {status === "success" && "Payment Successful!"}
          {status === "failed" && "Verification Failed"}
        </CardTitle>
        <CardDescription className="text-lg mt-2 text-gray-600">
          {message}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-6">
        <Button
          onClick={() => router.push("/dashboard/customer")}
          className={`w-full text-lg py-6 cursor-pointer ${status === "failed" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
        >
          Go to My Dashboard
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-xl font-bold animate-pulse">Loading...</div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
