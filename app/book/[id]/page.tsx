"use client";

import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Star, User } from "lucide-react";
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
      setIsLoading(true);

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
      serviceDate: format(date, "yyyy-MM-dd"),
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
      <div className="text-center mt-20 text-xl font-bold animate-pulse">
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
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg border-t-4 border-t-blue-600">
          <CardHeader className="bg-white rounded-t-xl border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl text-gray-900 mb-2">
                  {service.name}
                </CardTitle>
                <CardDescription className="text-gray-500 text-md">
                  {service.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-blue-600">
                  ${service.price}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8 mt-6">
            {/* Technician Details Card */}
            {service.technician && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex gap-4 items-center">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <User className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">
                    Assigned Technician
                  </p>
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl text-gray-800">
                      {service.technician.name}
                    </h3>
                    <div className="flex items-center text-yellow-600 font-bold bg-yellow-100 px-3 py-1 rounded-full text-sm">
                      <Star className="w-4 h-4 mr-1 fill-current" />{" "}
                      {service.technician.rating || 0} / 5
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />{" "}
                    Verified Expert
                  </p>
                </div>
              </div>
            )}

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border">
              <div className="space-y-2">
                <Label className="font-bold text-gray-700">Select Date</Label>
                <Popover>
                  <PopoverTrigger
                    className={cn(
                      "w-full justify-start text-left font-normal cursor-pointer py-6",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span className="text-lg">Pick a date</span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-gray-700">
                  Select Time Slot
                </Label>
                <Select onValueChange={(value) => setTimeSlot(String(value))}>
                  <SelectTrigger className="w-full cursor-pointer py-6 text-lg">
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                    <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-xl py-8 shadow-lg"
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
