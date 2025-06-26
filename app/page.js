import React, { Suspense } from "react";
import CashMonsterHomePage from "@/components/CashMonsterHomePage";
import { ModeToggle } from "@/components/mode-toggle";

/**
 * Main page component for Cash Money loan offers
 * @returns {JSX.Element} The rendered page
 */
export default function Page() {
  return (
    <div className="relative">
      {/* Theme toggle in top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ModeToggle />
      </div>
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-pulse text-xl font-semibold">Loading...</div>
        </div>
      }>
        <CashMonsterHomePage />
      </Suspense>
    </div>
  );
}