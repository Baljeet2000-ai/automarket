"use client";

import Image from "next/image";
import { useState } from "react";

interface VehicleImageProps {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}

export default function VehicleImage({
  src,
  alt,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: VehicleImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="flex h-full w-full items-center justify-center bg-slate-200 px-4 text-center text-sm font-medium text-slate-500"
      >
        {alt}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}