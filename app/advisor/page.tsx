"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdvisorPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <h1 className="mb-8 text-4xl font-semibold">Advisor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Advisor Profile Card */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>FA</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Your Financial Advisor</CardTitle>
                <CardDescription>Placeholder Name</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Placeholder description about the financial advisor. Discuss your goals, review your portfolio, and plan for the future.
              </p>
              <p><strong>Contact:</strong> advisor@example.com</p>
              <p><strong>Office Hours:</strong> M-F 9 AM - 5 PM</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar for Scheduling */}
        <div className="md:col-span-2 flex flex-col items-center">
           <h2 className="text-2xl font-semibold mb-4">Schedule an Appointment</h2>
           <Card className="p-4">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
             />
           </Card>
            <p className="mt-4 text-sm text-muted-foreground">
                Select a date to request an appointment. Further details will be confirmed via email.
            </p>
        </div>
      </div>
    </main>
  );
} 