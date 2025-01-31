"use client";

import React, {Suspense, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref, push } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, database } from "@/app/utils/firebase";
import Nav from "../components/Nav";

export default function OrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch current authenticated user
        onAuthStateChanged(auth, async (currentUser) => {
          if (currentUser) {
            const userRef = ref(database, `ecomusers/${currentUser.uid}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
              setUser(userSnapshot.val());
            }
          } else {
            setUser(null);
          }
        });

        // Fetch product details
        const productRef = ref(database, `products/${productId}`);
        const productSnapshot = await get(productRef);
        if (productSnapshot.exists()) {
          setProduct(productSnapshot.val());
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchData();
  }, [productId]);

  const handleConfirmOrder = async () => {
    try {
      const orderData = {
        userId: auth.currentUser?.uid,
        userName: user?.name,
        userAddress: user?.address,
        userPhone: user?.phoneNumber,
        productId,
        productName: product?.productName,
        productPrice: product?.price,
        timestamp: new Date().toISOString(),
      };

      // Save order in Firebase
      const ordersRef = ref(database, `orders`);
      await push(ordersRef, orderData);

      // Redirect to order confirmation or home page
      alert("Order placed successfully!");
      router.push("/");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place the order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!user || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Invalid order details!</p>
      </div>
    );
  }

  return (
     <Suspense fallback={<div>Loading...</div>}>
      <Nav />
      <section className="flex flex-col h-screen py-6 px-4 sm:px-8 lg:px-24 gap-6 lg:gap-12">
        <h1 className="text-3xl font-bold text-gray-800">Order Summary</h1>

        <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row">
          {/* User Details */}
          <div className="bg-gray-100 p-4 rounded-lg w-full lg:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700">
              Delivery Details
            </h2>
            <p className="mt-2 text-gray-600">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Address:</strong> {user.address}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Phone:</strong> {user.phoneNumber}
            </p>
          </div>

          {/* Product Details */}
          <div className="bg-gray-100 p-4 rounded-lg w-full lg:w-1/2">
            <h2 className="text-xl font-semibold text-gray-700">
              Product Details
            </h2>
            <p className="mt-2 text-gray-600">
              <strong>Product Name:</strong> {product.productName}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Price:</strong> ₹{product.price}
            </p>
            <p className="mt-1 text-gray-600">
              <strong>Description:</strong> {product.description}
            </p>
          </div>
        </div>

        {/* Confirm Order Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirmOrder}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
          >
            Confirm Order
          </button>
        </div>
      </section>
    </Suspense>
  );
}
