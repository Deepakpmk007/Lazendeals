"use client";

import React, { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import { database } from "@/app/utils/firebase";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersRef = ref(database, "orders");
      const snapShot = await get(ordersRef);

      if (snapShot.exists()) {
        const data = snapShot.val();
        const orderList = Object.entries(data).map(([id, order]) => ({
          id: id, // Order ID
          customerName: order.customerName,
          productName: order.productName,
          address: order.address,
          phoneNumber: order.phoneNumber,
          email: order.email,
          orderDate: order.orderDate || "N/A",
          status: order.status || "Pending",
        }));
        setOrders(orderList); // Store the order data in state
      } else {
        console.log("No orders available");
      }
    };
    fetchOrders();
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const orderRef = ref(database, `orders/${orderId}`);
    update(orderRef, { status: newStatus })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        console.log("Order status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  return (
    <div className="h-screen flex flex-col gap-10">
      <nav className="flex justify-between">
        <h1 className="font-bold text-2xl">Orders</h1>
      </nav>
      <div>
        <h1>List Of Orders</h1>
        <div>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Order ID
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Customer Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Product Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Address
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Phone Number
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Order Date
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.productName}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.address}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.phoneNumber}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.orderDate}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {order.status}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Finished">Finished</option>
                    </select>
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
