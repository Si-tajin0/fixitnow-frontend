import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-t-4 border-t-red-500 text-center py-8">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="w-20 h-20 text-red-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-lg mt-2 text-gray-600">
            Your payment was not completed. You can try again from your
            dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6">
          <Link href="/dashboard/customer">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-lg py-6 cursor-pointer">
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
