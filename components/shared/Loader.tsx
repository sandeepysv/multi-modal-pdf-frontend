"use client";

import Image from "next/image";

type Props = {
  size?: number;
};

const Loader = ({ size = 100 }: Props) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Image
        className="animate-bounce duration-800 transition"
        src="/logo.svg"
        alt="loader"
        width={size}
        height={size}
        priority={true}
      />
    </div>
  );
};

export default Loader;
