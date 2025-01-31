"use client";

import React, { useState, useEffect } from "react";
import { ref, update, onValue } from "firebase/database";
import { database } from "../utils/firebase";

const EditPopup = ({ productId, onClose }) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    quantity: "",
    discount: "",
    category: "",
  });

  useEffect(() => {
    if (productId) {
      const productRef = ref(database, `products/${productId}`);
      const unsubscribe = onValue(productRef, (snapshot) => {
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        }
      });

      return () => unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!productId) {
        alert("No product selected for editing.");
        return;
      }

      const productRef = ref(database, `products/${productId}`);
      await update(productRef, formData); // Update only the changed fields
      alert("Product details updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const { productName, description, price, quantity, discount, category } =
    formData;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Product</h2>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Product Name</label>
        <input
          type="text"
          name="productName"
          value={productName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Category</label>
        <input
          type="text"
          name="category"
          value={category}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Price</label>
        <input
          type="number"
          name="price"
          value={price}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={quantity}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Discount</label>
        <input
          type="number"
          name="discount"
          value={discount}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400"
      >
        Save Changes
      </button>
      <button
        onClick={onClose}
        className="w-full mt-2 py-3 px-4 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 focus:ring-4 focus:ring-gray-300"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditPopup;
