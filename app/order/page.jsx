"use client";

import React, { useEffect, useState, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref, push } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, database } from "@/app/utils/firebase";
import dynamic from "next/dynamic";

// Dynamic import for the component that uses `useSearchParams` with no SSR
const OrderPageContent = dynamic(
  () => import("../components/OrderPageContent"),
  { ssr: false }
);

export default function OrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderPageContent />
    </Suspense>
  );
}
