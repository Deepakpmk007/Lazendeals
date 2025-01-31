"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { database } from "../utils/firebase";
import { get, ref } from "firebase/database";

export default function Productpage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsRef = ref(database, "products");
      const snapshot = await get(productsRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedProducts = Object.entries(data).map(([id, product]) => ({
          id,
          name: product.productName,
          category: product.category,
          description: product.description,
          discount: product.discount,
          price: product.price,
          quantity: product.quantity,
          imageUrl: product.images?.[0] || "", // Use first image if available
        }));

        setProducts(formattedProducts);
      } else {
        console.log("No products available");
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-2 row-auto md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
      {products.map((el) => (
        <ProductCard
          key={el.id}
          imageUrl={el.imageUrl}
          name={el.name}
          price={el.price}
          id={el.id}
        />
      ))}
    </div>
  );
}
