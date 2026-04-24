"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  missionName: string;
}

export function ImageGallery({ images, missionName }: ImageGalleryProps) {
  const [selected, setSelected] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <section aria-labelledby="gallery-heading">
      <h2 id="gallery-heading" className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Mission Photos
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="list">
        {images.map((src, i) => (
          <div key={src} role="listitem">
            <button
              onClick={() => setSelected(src)}
              className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg overflow-hidden"
              aria-label={`View photo ${i + 1} of ${images.length} from ${missionName}`}
            >
              <Image
                src={src}
                alt={`${missionName} launch photo ${i + 1}`}
                width={400}
                height={280}
                className="object-cover w-full h-40 hover:opacity-90 transition-opacity"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl focus:outline-none focus:ring-2 focus:ring-white rounded"
            onClick={() => setSelected(null)}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <Image
            src={selected}
            alt="Full size mission photo"
            width={1200}
            height={800}
            className="max-h-[90vh] w-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}