"use client";

import React, { useEffect, useState } from "react";
import { database } from "@/app/utils/firebase";
import { ref, get } from "firebase/database";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      const productsRef = ref(database, "products");
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setProducts(data.slice(0, 5)); // Display minimum 5 products
        setTotalProducts(data.length);
      }
    };

    // Fetch users
    const fetchUsers = async () => {
      const usersRef = ref(database, "ecomusers");
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        setUsers(data.slice(0, 5)); // Display minimum 5 users
        setTotalUsers(data.length);
      }
    };

    fetchProducts();
    fetchUsers();
  }, []);

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
          <p className="text-2xl text-indigo-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Total Products
          </h3>
          <p className="text-2xl text-indigo-600">{totalProducts}</p>
        </div>
      </section>

      {/* Products Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">
                Category: {product.category}
              </p>
              <p className="text-xl text-indigo-600">₹{product.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">
                {user.name}
              </h3>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
