"use client";

import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-indigo-600 text-white hidden md:block">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="mt-10">
          <ul>
            <li>
              <Link
                href="/admin/"
                className="block py-2 px-4 hover:bg-indigo-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="block py-2 px-4 hover:bg-indigo-700"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className="block py-2 px-4 hover:bg-indigo-700"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/admin/customers"
                className="block py-2 px-4 hover:bg-indigo-700"
              >
                Customers
              </Link>
            </li>
            <li>
              <Link
                href="/admin/ads"
                className="block py-2 px-4 hover:bg-indigo-700"
              >
                Ads
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white p-4 shadow-md">
          <div className="text-xl font-semibold">E-commerce Admin</div>
        </header>
        <main className="flex-1 p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
