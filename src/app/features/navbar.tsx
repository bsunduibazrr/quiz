"use client";
import { useState } from "react";

export const Navbar = () => {
  const [image, setImage] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex justify-between items-center pt-4 md:pt-6 px-4 md:px-10">
        <p className="text-[18px] sm:text-[20px] font-semibold text-black">
          Quiz app
        </p>

        <img
          className="rounded-full w-15 h-15 object-cover cursor-pointer"
          src="pro.jpg"
          alt="Profile"
          onClick={() => setImage(true)}
        />
      </div>
      {image && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-3 cursor-pointer"
          onClick={() => setImage(false)}
        >
          <img
            className="rounded-full w-150 h-150 object-cover max-sm:w-80 max-sm:h-80"
            src="pro.jpg"
            alt="Profile"
          />
        </div>
      )}
      <div className="w-full h-0.5 bg-gray-300"></div>
    </div>
  );
};

// sm:w-10 sm:h-10
