"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref, update, push } from "firebase/database";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { FaLocationDot } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import getProductById from "@/app/utils/firebase/getProduct";
import { auth, database } from "@/app/utils/firebase";
import Nav from "@/app/components/Nav";

export default function ProductDetails() {
  const { product } = useParams();
  const [productData, setProductData] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        try {
          const userRef = ref(database, `ecomusers/${currentUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUser(snapshot.val());
          } else {
            setUser({ name: "User ", address: "Address not found" });
          }
        } catch (error) {
          console.error("Error fetching user address:", error);
          setError("Failed to fetch user details. Please try again.");
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(product);
        if (!productData) throw new Error("Product not found");
        setProductData(productData);
        await fetchReviews(product);
      } catch (error) {
        console.error("Error fetching product and reviews:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [product]);

  const fetchReviews = async (productId) => {
    const reviewsListRef = ref(database, `products/${productId}/reviews`);
    const reviewIdsSnapshot = await get(reviewsListRef);
    if (reviewIdsSnapshot.exists()) {
      const reviewIds = Object.values(reviewIdsSnapshot.val());
      const fetchedReviews = await Promise.all(
        reviewIds.map(async (reviewId) => {
          const reviewRef = ref(database, `reviews/${productId}/${reviewId}`);
          const reviewSnapshot = await get(reviewRef);
          return reviewSnapshot.exists()
            ? { id: reviewId, ...reviewSnapshot.val() }
            : null;
        })
      );
      setReviews(fetchedReviews.filter(Boolean));
    }
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim()) return;

    try {
      const reviewData = {
        review: newReview,
        user: user?.name || "Anonymous",
        timestamp: new Date().toISOString(),
      };
      const reviewsRef = ref(database, `reviews/${product}`);
      const newReviewRef = push(reviewsRef);
      await update(newReviewRef, reviewData);

      const productReviewsRef = ref(database, `products/${product}/reviews`);
      await push(productReviewsRef, newReviewRef.key);

      setReviews((prevReviews) => [
        ...prevReviews,
        { id: newReviewRef.key, ...reviewData },
      ]);
      setNewReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  const handleAddToCart = async () => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      // Define the reference for the user's cart
      const userCartRef = ref(database, `ecomusers/${user.id}/cart`);

      // Retrieve the current cart items
      const cartSnapshot = await get(userCartRef);
      let cartItems = cartSnapshot.exists() ? cartSnapshot.val() : [];

      // Ensure cartItems is an array
      if (!Array.isArray(cartItems)) {
        cartItems = Object.values(cartItems); // Convert object to array if necessary
      }

      // Check if the product is already in the cart
      if (!cartItems.includes(product)) {
        // Add the product ID to the cart
        cartItems.push(product);

        // Update the cart in Firebase
        await update(userCartRef, { ...cartItems }); // Use an object to update

        alert("Product added to cart!");
      } else {
        alert("Product is already in your cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add to cart. Please try again.");
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

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">No product found!</p>
      </div>
    );
  }

  const {
    images = [],
    productName = "Unknown Product",
    price = 0,
    originalPrice = 0,
    description = "No description available.",
  } = productData;

  return (
    <>
      <Nav />
      <section className="flex flex-col lg:flex-row py-6 px-4 sm:px-8 lg:px-24 gap-6 lg:gap-12 h-fit overflow-y-auto">
        <div className="flex flex-col gap-6 lg:gap-8 lg:w-1/2">
          {/* Image Section */}
          <div className="relative w-full lg:max-w-[450px] h-auto sm:h-[400px] lg:h-[500px] mx-auto">
            <Fade>
              {images.length > 0 ? (
                images.map((imageUrl, index) => (
                  <div key={index} className="relative w-full h-full">
                    <img
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center w-full h-full bg-gray-200 text-gray-600">
                  No Images Available
                </div>
              )}
            </Fade>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8 w-full lg:w-1/2 overflow-y-auto">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            {productName}
          </h3>

          <div className="flex items-center gap-4">
            <div className="text-lg sm:text-xl font-bold text-gray-800">
              ₹{price}
            </div>
          </div>

          <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-gray-700">
            {description}
          </p>

          {/* Buttons */}
          <div className="flex justify-center items-center gap-4 sm:gap-6 w-full mt-6">
            <button
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
              onClick={() => router.push(`/order?productId=${product}`)}
            >
              Buy Now
            </button>
            <button
              className="bg-gray-300 text-black py-3 px-6 rounded-lg font-bold text-lg hover:bg-gray-400 transition"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="text-sm sm:text-base lg:text-lg flex items-center gap-2 text-gray-500">
              <FaLocationDot />
              Delivery to:
            </p>
            <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
              {user?.address || "Please log in to see your delivery address"}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Leave a Review
              </h3>
              <textarea
                rows={4}
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="border border-gray-300 rounded-lg w-full px-4 py-2 mt-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Write your review here..."
              />
              <button
                onClick={handleReviewSubmit}
                className="mt-3 bg-blue-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Customer Reviews
              </h3>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 py-2"
                  >
                    <p className="text-gray-600 text-sm">{review.review}</p>
                    <p className="text-gray-400 text-xs">
                      {new Date(review.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="mt-2 text-sm text-gray-600">
                  No reviews yet. Be the first to write one!
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
