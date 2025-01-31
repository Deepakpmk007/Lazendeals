"use client";

import AddProductPopup from "@/app/components/AddProductPopup";
import React, { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { database } from "@/app/utils/firebase";
import EditPopup from "@/app/components/EditPopup";

export default function Products() {
  const [addProduct, setAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const productsRef = ref(database, "products");
      const snapShot = await get(productsRef);

      if (snapShot.exists()) {
        const data = snapShot.val();
        const productList = Object.entries(data).map(([id, product]) => ({
          id: id, // Product ID
          name: product.productName,
          price: product.price,
          quantity: product.quantity,
          discount: product.discount,
        }));
        setProducts(productList); // Store the product data in state
      } else {
        console.log("No products available");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Set the product to be edited
    setEditProduct(true); // Open the edit popup
  };

  const handlePopupClose = () => {
    setEditProduct(false); // Close the popup
    setSelectedProduct(null); // Reset the selected product
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(productId);

    try {
      await remove(ref(database, `products/${productId}`)); // Delete from database
      setProducts((prev) => prev.filter((product) => product.id !== productId)); // Update UI
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="h-screen flex flex-col gap-10">
      <nav className="flex justify-between">
        <h1 className="font-bold text-2xl">Products</h1>
        <button
          className="bg-slate-500 px-3 py-2 rounded-md"
          onClick={() => setAddProduct(!addProduct)}
        >
          Add New Product
        </button>
      </nav>
      <div className="absolute top-0 right-0 flex items-center justify-center">
        {addProduct && (
          <div className="blurColor w-screen h-fit p-3">
            <button
              className="ml-6 p-3 bg-red-400 rounded-full"
              onClick={() => setAddProduct(!addProduct)}
            >
              X
            </button>
            <AddProductPopup />
          </div>
        )}
        {editProduct && (
          <div className="blurColor w-screen h-fit p-3">
            <button
              className="ml-6 p-3 bg-red-400 rounded-full"
              onClick={() => setEditProduct(false)}
            >
              X
            </button>
            <EditPopup productId={selectedProduct} onClose={handlePopupClose} />
          </div>
        )}
      </div>
      <div>
        <h1>List Of Products</h1>
        <div>
          <table className="min-w-full table-auto border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Product ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Quantity
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Edit
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {product.id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {product.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    ₹{product.price}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      className="bg-green-500 text-white rounded-xl px-5 py-2"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      className="bg-red-500 text-white rounded-xl px-5 py-2"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No products available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
