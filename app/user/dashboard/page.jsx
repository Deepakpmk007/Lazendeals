"use client";

import React from "react";
import UserProfile from "@/app/userComponents/UserProfile";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/utils/firebase"; // Ensure you have this in your Firebase config
import Nav from "@/app/components/Nav";

export default function Page() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert("You have been signed out successfully.");
      router.push("/login"); // Redirect user to the login page after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <>
      <Nav />
      <div className="h-screen flex flex-col md:flex-row gap-4">
        <section className="bg-slate-300 w-full md:w-3/4 mx-auto p-5">
          <UserProfile />
          <div className="flex flex-col sm:flex-row sm:justify-center md:justify-start gap-4 mt-6">
            <button
              className="rounded-sm bg-gray-800 text-white py-2 px-4 hover:bg-gray-600 w-full sm:w-[250px] md:w-[300px]"
              onClick={() => router.push("/order")}
            >
              My Order
            </button>
            <button
              className="rounded-sm bg-gray-800 text-white py-2 px-4 hover:bg-gray-600 w-full sm:w-[250px] md:w-[300px]"
              onClick={() => router.push("/cart")}
            >
              My Cart
            </button>
            <button
              className="rounded-sm bg-red-700 text-white py-2 px-4 hover:bg-red-500 w-full sm:w-[250px] md:w-[300px]"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
