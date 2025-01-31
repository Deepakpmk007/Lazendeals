import React from "react";
import ProductCard from "./ProductCard";
import getAllProduct from "../utils/firebase/getAllProduct";

export default async function Productpage() {
  const data = await getAllProduct();

  return (
    <div className="grid grid-cols-2 row-auto md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-5">
      {data.map((el, i) => (
        <ProductCard
          key={i}
          imageUrl={el.imageUrl}
          name={el.name}
          price={el.price}
          id={el.id}
        />
      ))}
    </div>
  );
}
