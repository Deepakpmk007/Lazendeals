"use client";

import React, { useState, useEffect } from "react";
import { storage, database } from "@/app/utils/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ref as dbRef, set, remove, onValue } from "firebase/database";
import { v4 as uuidv4 } from "uuid";

export default function AdsPage() {
  const [ads, setAds] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const adsRef = dbRef(database, "ads");

    // Real-time listener for changes in the database
    const unsubscribe = onValue(adsRef, (snapshot) => {
      if (snapshot.exists()) {
        setAds(Object.entries(snapshot.val()));
      } else {
        setAds([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const uploadAd = async () => {
    if (!selectedFile) return alert("Please select a file to upload.");

    setLoading(true);
    try {
      const fileId = uuidv4();
      const storageRef = ref(storage, `ads/${fileId}`);
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);

      await set(dbRef(database, `ads/${fileId}`), {
        imageUrl: downloadURL,
        fileId,
      });

      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading ad:", error);
      alert("Failed to upload ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (fileId) => {
    setDeleting(fileId);
    try {
      const storageRef = ref(storage, `ads/${fileId}`);
      await deleteObject(storageRef);
      await remove(dbRef(database, `ads/${fileId}`));
    } catch (error) {
      console.error("Error deleting ad:", error);
      alert("Failed to delete ad. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Manage Ads</h1>

      {/* File Upload Section */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded-md w-full"
        />
        <button
          onClick={uploadAd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Ad"}
        </button>
      </div>

      {/* Ads Display Grid */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ads.length > 0 ? (
          ads.map(([id, ad]) => (
            <div
              key={id}
              className="border p-4 rounded-lg flex flex-col items-center bg-gray-50 shadow-sm"
            >
              <img
                src={ad.imageUrl}
                alt="Ad"
                className="w-full h-40 object-cover rounded-md"
              />
              <button
                onClick={() => deleteAd(ad.fileId)}
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md"
                disabled={deleting === ad.fileId}
              >
                {deleting === ad.fileId ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No ads available.</p>
        )}
      </div>
    </div>
  );
}
