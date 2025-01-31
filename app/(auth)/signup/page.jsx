"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/app/utils/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/utils/redux/slice/userSlice";

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Form State
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Local State
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Event Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    const { email, password, confirmPassword } = form;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      // Create user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Add user profile to Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, `ecomusers/${user.uid}`), {
        id: user.uid,
        email: user.email || "",
        name: "New User", // Default name
        role: "customer", // Default role
        createdAt: new Date().toISOString(), // Timestamp when the user is created
      });

      // Update Redux Store
      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
          name: "New User",
          photoUrl: "",
          createdAt: new Date().toISOString(),
        })
      );

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Signup error:", error.message); // Log specific error
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already in use. Please try another one.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else {
        setError("An error occurred during signup. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Add user profile to Firebase Realtime Database
      const db = getDatabase();
      await set(ref(db, `ecomusers/${user.uid}`), {
        id: user.uid,
        email: user.email || "",
        name: user.displayName || "Google User", // Google user's name
        photoUrl: user.photoURL || "",
        role: "customer", // Default role
        createdAt: new Date().toISOString(), // Timestamp when the user is created
      });

      // Update Redux Store
      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || "Google User",
          photoUrl: user.photoURL,
          createdAt: new Date().toISOString(),
        })
      );

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Google Sign-In error:", error.message); // Log specific error
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      className="flex justify-center items-center min-h-screen bg-transparent"
      onSubmit={handleSubmit}
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Signup</h1>
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login
          </Link>
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md">{error}</div>
        )}

        <div className="flex flex-col gap-4">
          <label htmlFor="email" className="text-gray-800 font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded-md p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="password" className="text-gray-800 font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="border rounded-md p-3 text-black outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label
            htmlFor="confirmPassword"
            className="text-gray-800 font-medium"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="border rounded-md p-3 text-black outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-3 rounded-md font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Signup
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 p-3 rounded-md hover:shadow-md disabled:bg-gray-200 disabled:cursor-not-allowed w-full"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
        </div>
      </div>
    </form>
  );
}
