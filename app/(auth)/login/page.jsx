"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/app/utils/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/utils/redux/slice/userSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  // Custom error messages for Firebase error codes
  const firebaseErrorMessages = {
    "auth/user-not-found": "No user found with this email. Please sign up.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-email":
      "The email address is invalid. Please enter a valid email.",
    "auth/popup-closed-by-user":
      "The sign-in popup was closed. Please try again.",
    "auth/cancelled-popup-request":
      "Another popup request is already in progress.",
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear previous errors when user changes input
    setResetSuccess("");
  };

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    const { email, password } = form;

    // Check if email and password are valid
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Dispatch user data to Redux store
      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || "Guest",
          photoUrl: user.photoURL || null,
          createdAt: user.metadata.creationTime,
        })
      );

      router.push("/"); // Redirect to the home page after successful login
    } catch (error) {
      const errorMessage =
        firebaseErrorMessages[error.code] ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Dispatch user data to Redux store
      dispatch(
        setUser({
          id: user.uid,
          email: user.email,
          name: user.displayName || "Guest",
          photoUrl: user.photoURL || null,
          createdAt: user.metadata.creationTime,
        })
      );

      router.push("/"); // Redirect to home page after successful Google sign-in
    } catch (error) {
      setError(
        firebaseErrorMessages[error.code] ||
          "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handlePasswordReset = async () => {
    if (!form.email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, form.email);
      setResetSuccess("Password reset email sent! Please check your inbox.");
      setError(""); // Clear any previous errors
      setForm({ email: "", password: "" }); // Reset form fields
    } catch (error) {
      setError(
        firebaseErrorMessages[error.code] ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility (show/hide password)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center min-h-screen "
    >
      <div className="bg-white shadow-md rounded-lg p-8 w-96 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
        <p className="text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>

        {/* Error and Reset Success Messages */}
        {error && (
          <div
            className="bg-red-100 text-red-700 p-2 rounded-md"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {resetSuccess && (
          <div
            className="bg-green-100 text-green-700 p-2 rounded-md"
            aria-live="polite"
          >
            {resetSuccess}
          </div>
        )}
        {loading && (
          <div className="bg-blue-100 text-blue-700 p-2 rounded-md">
            Processing your request...
          </div>
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
            className="border rounded-md p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            required
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
              className="border rounded-md p-3 text-black outline-none focus:ring-2 focus:ring-blue-500 w-full"
              required
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
            Login
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-800 p-3 rounded-md hover:shadow-md disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handlePasswordReset}
            disabled={loading}
            className="text-blue-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </form>
  );
}
