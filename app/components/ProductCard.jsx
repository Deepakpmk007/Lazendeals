"use client";

import React from "react";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function ProductCard({ imageUrl, name, price, id }) {
  const router = useRouter();
  return (
    <div
      className="border rounded-xl w-full justify-center h-full flex grow flex-col gap-3 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
      onClick={() => {
        console.log("clickc");
        router.push(`/product/${id}`);
      }}
    >
      <div className="relative w-full h-[230px]  md:h-[260px] mb-4">
        <Image
          src={imageUrl || "/image/download.webp"}
          alt={name}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          className="rounded-t-2xl"
        />
        {/* <button className="absolute top-5 right-5 bg-white p-2 rounded-full border border-black">
            <FaRegHeart />
          </button> */}
      </div>
      <div className="flex flex-col gap-2 px-5 justify-center mb-2 ">
        <h2 className="text-lg font-semibold md:text-xl md:font-extrabold text-gray-800 rounded-md">
          {name}
        </h2>
        <p className="text-gray-500">{price}</p>
      </div>
    </div>
  );
}
