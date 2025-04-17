import React, { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  title: string;
  description?: string; // Optional subtitle
  content: ReactNode;
  actions?: {
    label: string;
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    onClick?: () => void;
  }[];
}

export function AnswerCard({
  title,
  description,
  content,
  actions,
}: AnswerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{content}</CardContent>
      {actions && actions.length > 0 && (
        <CardFooter className="flex justify-end space-x-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "default"}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </CardFooter>
      )}
    </Card>
  );
} 