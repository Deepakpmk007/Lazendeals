"use client";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { RiMenu3Line } from "react-icons/ri";
import { RiCloseLine } from "react-icons/ri";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const animation = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: {
        delay: 0.2,
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <div className="h-[7vh] md:h-[10vh]  flex items-center justify-between">
        <div
          onClick={() => {
            router.push("/");
          }}
          className="font-logo text-lg md:text-[2rem] tracking-wide font-bold cursor-pointer"
        >
          Lazendeals
        </div>
        <div className="hidden md:flex bg-slate-50 h-[40px] justify-center items-center rounded-lg px-3">
          <CiSearch className="text-lg font-bold" />
          <input
            type="text"
            className="w-[400px] h-[40px] outline-none text-lg px-4 rounded-md bg-transparent"
          />
        </div>
        <div className="">
          {isOpen ? (
            <RiMenu3Line
              className="text-lg"
              onClick={() => setIsOpen(!isOpen)}
            />
          ) : (
            <RiCloseLine
              className="text-lg"
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            variants={animation}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute right-0 bg-custom-gradient font-mono w-screen md:w-[400px]   h-screen mb-7 z-10 flex flex-col pt-10 items-center gap-5 font-semibold text-lg"
          >
            <ul className="list-none flex flex-col items-center gap-5">
              <li
                className="text-lg font-bold text-center w-[150px] bg-red-400 rounded-sm px-4 py-2 cursor-pointer"
                onClick={() => {
                  router.push("/user/dashboard");
                  setIsOpen(!isOpen);
                }}
              >
                Profile
              </li>
              <li
                className="text-lg font-bold text-center w-[150px] bg-red-400 rounded-sm px-4 py-2 cursor-pointer"
                onClick={() => {
                  router.push("/cart");
                  setIsOpen(!isOpen);
                }}
              >
                Cart
              </li>{" "}
              <li
                className="text-lg font-bold text-center w-[150px] bg-red-400 rounded-sm px-4 py-2 cursor-pointer"
                onClick={() => {
                  router.push("/order");
                  setIsOpen(!isOpen);
                }}
              >
                My Order
              </li>
            </ul>
            <div className="flex flex-col items-center gap-5">
              <button
                className=" bg-red-400 text-center w-[150px] rounded-sm px-4 py-2"
                onClick={() => {
                  router.push("/login");
                  setIsOpen(!isOpen);
                }}
              >
                Login
              </button>

              <button
                onClick={() => {
                  router.push("/signup");
                  setIsOpen(!isOpen);
                }}
                className=" bg-red-400 text-center w-[150px]   rounded-sm px-4 py-2"
              >
                SignUp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
