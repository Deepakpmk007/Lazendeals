import { Suspense } from "react";
import Categories from "./components/Categories";
import Productpage from "./components/Productpage";
import AdSlider from "./components/AdSlider";
import Nav from "./components/Nav";

function page() {
  const cate = [
    "Organic Products",
    "Home Made Products",
    "Home Products",
    "Clothing",
    "Paintings",
    "TamilNadu Snacks and Sweets",
  ];
  return (
    <>
      <Nav />
      <main className="flex flex-col gap-8">
        {/* <div className="flex justify-center bg-transparent border-none items-center w-full h-[40vh] sm:h-[50vh] bg-gradient-to-r from-gray-100 to-gray-200 p-4"> */}
        <AdSlider />
        {/* </div> */}
        <div className="flex items-center h-[50%] justify-start gap-4 overflow-x-scroll no-scrollbar px-5">
          {cate.map((el, i) => (
            <Categories key={i} name={el} />
          ))}
        </div>
        <div className="flex flex-col gap-5 justify-start ">
          <p className="font-bold text-2xl">All Products</p>
          <Suspense fallback={<p>Looading....</p>}>
            <Productpage />
          </Suspense>
        </div>
      </main>
    </>
  );
}

export default page;
