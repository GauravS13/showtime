"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center py-16">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-muted-foreground">Loading...</p>
    </div>
  );
}
