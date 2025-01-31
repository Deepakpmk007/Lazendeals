"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { database, auth } from "@/app/utils/firebase"; // Import Firebase config
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import Nav from "../components/Nav";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Listen for user authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Set user ID
      } else {
        setUserId(null); // User is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems(userId);
    }
  }, [userId]);

  const fetchCartItems = async (uid) => {
    if (!uid) return;
    setLoading(true);

    try {
      // Fetch user's cart from Firebase Database
      const userCartRef = ref(database, `ecomusers/${uid}/cart`);
      const cartSnapshot = await get(userCartRef);

      if (cartSnapshot.exists()) {
        const cartProductIds = Object.values(cartSnapshot.val()); // Get product IDs

        // Fetch product details from products collection
        const productPromises = cartProductIds.map(async (productId) => {
          const productRef = ref(database, `products/${productId}`);
          const productSnapshot = await get(productRef);
          return productSnapshot.exists()
            ? { id: productId, ...productSnapshot.val() }
            : null;
        });

        const fetchedProducts = (await Promise.all(productPromises)).filter(
          Boolean
        );
        setCartItems(fetchedProducts);
      } else {
        setCartItems([]); // No cart items
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
    setLoading(false);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

          {loading ? (
            <p className="text-lg text-gray-600 text-center">Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <p className="text-lg text-gray-600 text-center">
              Your cart is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cartItems.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105"
                >
                  <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.productName}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <p className="text-lg md:text-xl font-semibold">
                      {product.productName}
                    </p>
                    <p className="text-lg font-bold text-blue-500">
                      ₹{product.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
