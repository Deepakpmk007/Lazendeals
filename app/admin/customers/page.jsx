"use client";

import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "@/app/utils/firebase";
import EditPopup from "@/app/components/EditPopup"; // Adjust this for customer editing if necessary

export default function page() {
  const [customers, setCustomers] = useState([]);
  const [editCustomer, setEditCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      const customersRef = ref(database, "ecomusers");
      const snapShot = await get(customersRef);

      if (snapShot.exists()) {
        const data = snapShot.val();
        const customerList = Object.entries(data).map(([id, customer]) => ({
          id: id, // Customer ID
          name: customer.name,
          email: customer.email,
        }));
        setCustomers(customerList); // Store the customer data in state
      } else {
        console.log("No customers available");
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="h-screen flex flex-col gap-10">
      <nav className="flex justify-between">
        <h1 className="font-bold text-2xl">Customers</h1>
      </nav>

      <div>
        <h1>List Of Customers</h1>
        <div>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Customer ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Email
                </th>

                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {customer.id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {customer.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {customer.email}
                  </td>

                  <td className="px-4 py-2 text-sm cursor-pointer">
                    <button className="bg-red-500 rounded-xl px-5 py-2 text-white">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
