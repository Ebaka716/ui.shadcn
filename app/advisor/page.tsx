"use client";

import React from "react";
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdvisorPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="relative min-h-screen">
      <main className="flex flex-col items-center pb-32">
        <div className="w-full max-w-[800px] space-y-6">
          <h1 className="text-3xl font-semibold">Advisor Dashboard</h1>

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

          <Card>
            <CardHeader>
                <CardTitle>Schedule an Appointment</CardTitle>
                <CardDescription>Select a date to request an appointment. Further details will be confirmed via email.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                 />
             </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 