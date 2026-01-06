"use client";
import { useState } from "react";

export const Navbar = () => {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex justify-between items-center pt-4 md:pt-6 px-4 md:px-10">
        <p className="text-[18px] sm:text-[20px] font-semibold text-black">
          Quiz app
        </p>
      </div>

      <div className="w-full h-0.5 bg-gray-300"></div>
    </div>
  );
};

// sm:w-10 sm:h-10
