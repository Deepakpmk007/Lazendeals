"use client";

import React, { useReducer, useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../utils/firebase";

// Reducer for managing form state
const formReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_IMAGES":
      return { ...state, images: [...state.images, ...action.files] };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  category: "",
  productName: "",
  description: "",
  price: "",
  quantity: "",
  discount: "",
  images: [],
};

const AddProductPopup = () => {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "UPDATE_FIELD", field: name, value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    dispatch({ type: "ADD_IMAGES", files });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Upload images to Firebase Storage
      const uploadedImages = await Promise.all(
        formState.images.map(async (image) => {
          const storageReference = storageRef(
            storage,
            `products/${image.name}`
          );
          await uploadBytes(storageReference, image);
          return await getDownloadURL(storageReference);
        })
      );

      // Prepare product data
      const productData = {
        ...formState,
        images: uploadedImages,
      };

      // Save product data to Firebase Realtime Database
      const newProductRef = push(ref(database, "products"));
      await set(newProductRef, productData);

      alert("Product added successfully!");
      dispatch({ type: "RESET_FORM" });
    } catch (error) {
      console.error("Error saving product: ", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoryOptions = () => {
    if (formState.category === "Shirt") {
      return (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Size</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => console.log(e.target.value)}
          >
            <option value="">Select Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
      );
    } else if (formState.category === "Food") {
      return (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Weight</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => console.log(e.target.value)}
          >
            <option value="">Select Weight</option>
            <option value="500g">500g</option>
            <option value="1000g">1000g</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Product Name</label>
        <input
          type="text"
          name="productName"
          placeholder="Enter product name"
          value={formState.productName}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          name="description"
          placeholder="Enter product description"
          value={formState.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="4"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Category</label>
        <select
          name="category"
          value={formState.category}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Category</option>
          <option value="Shirt">Shirt</option>
          <option value="Food">Food</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {renderCategoryOptions()}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Price</label>
        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={formState.price}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Discount</label>
        <input
          type="number"
          name="discount"
          placeholder="Enter discount"
          value={formState.discount}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Quantity</label>
        <input
          type="number"
          name="quantity"
          placeholder="Enter quantity"
          value={formState.quantity}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Product Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <ul className="mt-2 space-y-1">
          {formState.images.map((file, index) => (
            <li key={index} className="text-sm text-gray-600">
              {file.name}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-400 disabled:opacity-50"
      >
        {isLoading ? "Adding Product..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProductPopup;
