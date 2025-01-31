import React from "react";

export default function Categories({ name }) {
  return (
    <button className="bg-gray-600 text-white  px-5 py-2 rounded-full text-base font-medium transition-all duration-300 transform hover:bg-gray-800 hover:text-gray-200 hover:scale-102 min-w-fit">
      {name}
    </button>
  );
}
