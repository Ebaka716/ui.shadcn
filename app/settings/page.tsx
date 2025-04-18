'use client';

import React from 'react';
import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <section className="space-y-3">
        <h2 className="text-lg font-medium">Appearance</h2>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Select the display theme.</p>
          <ThemeToggle />
        </div>
      </section>

      {/* Add more settings sections here as needed */}
    </div>
  );
} 