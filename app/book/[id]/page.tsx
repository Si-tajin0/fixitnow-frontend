"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BookingRequestData, Service } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  createBookingAction,
  getSingleServiceAction,
} from "@/service/bookingActions";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const fetchedService = await getSingleServiceAction(params.id as string);
      setService(fetchedService);
      setIsLoading(false);
    };
    loadData();
  }, [params.id]);

  const handleBooking = async () => {
    if (!date || !timeSlot) {
      toast.error("Please select a date and time slot!");
      return;
    }

    if (!service) {
      toast.error("Service not found!");
      return;
    }

    setIsSubmitting(true);

    const bookingData: BookingRequestData = {
      serviceId: service.id,
      technicianId: service.technicianId,
      serviceDate: date.toISOString(),
      scheduledTime: timeSlot,
    };

    const result = await createBookingAction(bookingData);

    if (result.success) {
      toast.success(result.message);
      router.push("/dashboard/customer");
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  if (isLoading)
    return (
      <div className="text-center mt-20 text-xl font-bold">
        Loading Service Details...
      </div>
    );
  if (!service)
    return (
      <div className="text-center mt-20 text-red-500 text-xl">
        Service not found!
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-blue-600 text-white rounded-t-xl">
            <CardTitle className="text-2xl">Confirm Your Booking</CardTitle>
            <CardDescription className="text-blue-100">
              Select your preferred date and time for the service.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 mt-6">
            <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {service.name}
                </h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
              </div>
              <div className="text-2xl font-extrabold text-blue-600">
                ${service.price}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger
                  className={cn(
                    "w-full justify-start text-left font-normal cursor-pointer",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Select Time Slot</Label>
              <Select onValueChange={(value) => setTimeSlot(value as string)}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning (9 AM - 12 PM)">
                    Morning (9 AM - 12 PM)
                  </SelectItem>
                  <SelectItem value="Afternoon (1 PM - 4 PM)">
                    Afternoon (1 PM - 4 PM)
                  </SelectItem>
                  <SelectItem value="Evening (5 PM - 8 PM)">
                    Evening (5 PM - 8 PM)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-lg py-6"
              onClick={handleBooking}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm Booking Request"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
