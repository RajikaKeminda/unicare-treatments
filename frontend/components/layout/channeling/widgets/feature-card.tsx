"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
export interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  imageUrl: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  href,
  imageUrl,
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-xl font-semibold mb-2 text-center">{title}</div>
      <Link
        href={href}
        className="relative overflow-hidden w-[full] aspect-[4/3] cursor-pointer rounded-lg bg-white border-black border-2 group"
      >
        <Image
          src={imageUrl}
          alt="feature"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition transform duration-500 ease-in-out group-hover:scale-[112%]"
        />

        <div className="absolute bottom-0 left-0 w-full  flex flex-col gap-0.2 p-2 bg-white/60 backdrop-blur-md border-t-2 border-black">
          <div className=" text-center text-balance max-w-[300px] mx-auto">
            {description}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default FeatureCard;
