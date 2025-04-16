"use client";
import { Suspense } from "react";
import RadiologistManagement from "./_components/RadiologistManagement"

export default function RadiologistsPage() {
  return (
    <Suspense fallback={<div className="p-4 flex justify-center">
      <div className="w-12 h-12 border-4 border-stone-500 border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <RadiologistManagement />
    </Suspense>
  );
}