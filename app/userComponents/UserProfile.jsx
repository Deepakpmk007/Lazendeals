"use client";

import React, { useEffect, useState } from "react";
import { getAuthUser } from "../utils/firebase/getUserData"; // Assuming this fetches the authenticated user
import { getDatabase, ref, get, set } from "firebase/database"; // Import Firebase Realtime Database functions
import { auth } from "../utils/firebase"; // Ensure you have initialized auth

export default function UserProfile() {
  const [authUser, setAuthUser] = useState(null); // Store authenticated user data
  const [loading, setLoading] = useState(true); // Loading state
  const [userDetails, setUserDetails] = useState({
    phoneNumber: "",
    address: "",
  });

  useEffect(() => {
    const unsubscribe = getAuthUser((user) => {
      setAuthUser(user);
      if (user) {
        fetchUserDetails(user.uid); // Fetch user details from Firebase
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const fetchUserDetails = async (uid) => {
    const db = getDatabase();
    const userRef = ref(db, `ecomusers/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      setUserDetails({
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
      });
    }
  };

  const handleEdit = async () => {
    if (!authUser) return;

    const db = getDatabase();
    const userRef = ref(db, `ecomusers/${authUser.uid}`);
    await set(userRef, {
      ...userDetails,
      id: authUser.uid,
      email: authUser.email,
      name: authUser.displayName || "N/A",
      role: "customer",
      createdAt: new Date().toISOString(),
    });

    alert("User details updated successfully!");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authUser) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 p-4 sm:p-6 md:p-9">
      <div className="flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
          User Details
        </h1>
        <div className="flex flex-col gap-5 bg-slate-100 w-full p-4 sm:p-5 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] rounded-full bg-gray-800 flex justify-center items-center text-white font-bold">
              {authUser.photoURL ? (
                <img
                  src={authUser.photoURL}
                  alt="User Avatar"
                  className="w-full h-full rounded-full"
                />
              ) : (
                "Image"
              )}
            </div>
            <div className="text-base sm:text-lg font-medium">
              {authUser.displayName || "N/A"}
            </div>
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-medium mt-3">
              Email: {authUser.email || "N/A"}
            </h1>

            <h1 className="text-sm sm:text-base font-medium mt-2">
              Phone Number: {userDetails.phoneNumber || "Not provided"}
            </h1>
            <h1 className="text-sm sm:text-base font-medium mt-2">
              Address: {userDetails.address || "Not provided"}
            </h1>
          </div>
        </div>
      </div>

      {/* Edit User Details Section */}
      <div className="flex-1 mt-5 md:mt-0">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
          Edit Details
        </h1>
        <div className="flex flex-col gap-5 bg-slate-100 w-full p-4 sm:p-5 rounded-lg shadow-md">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="phoneNumber"
                className="text-sm sm:text-base font-medium"
              >
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                value={userDetails.phoneNumber}
                onChange={handleChange}
                className="border p-2 mt-2 rounded"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="address"
                className="text-sm sm:text-base font-medium"
              >
                Address
              </label>
              <textarea
                name="address"
                id="address"
                value={userDetails.address}
                onChange={handleChange}
                className="border p-2 mt-2 rounded"
                rows="4"
                placeholder="Enter address"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
