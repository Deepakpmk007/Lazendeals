"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { database } from "@/app/utils/firebase";
import { ref as dbRef, get } from "firebase/database";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css"; // Import default styles

export default function AdSlider() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    try {
      const adsRef = dbRef(database, "ads");
      const snapshot = await get(adsRef);

      if (snapshot.exists()) {
        const adList = Object.values(snapshot.val()).map((ad) => ({
          id: ad.fileId,
          url: ad.imageUrl,
        }));

        setAds(adList);
      } else {
        setAds([]);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8 px-4 bg-white rounded-xl shadow-lg">
      {ads.length > 0 ? (
        <Slide
          autoplay={true}
          duration={5000} // 5s per slide
          transitionDuration={700} // Smooth transition
          infinite={true}
          indicators
          arrows={false}
        >
          {ads.map((ad, i) => (
            <div
              key={ad.id}
              className="relative flex justify-center items-center w-full h-[180px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-lg overflow-hidden shadow-md bg-gray-200"
            >
              <Image
                src={ad.url}
                alt={`Ad ${i + 1}`}
                fill
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
              />
            </div>
          ))}
        </Slide>
      ) : (
        <p className="text-center text-gray-500 text-lg">No ads available.</p>
      )}
    </div>
  );
}
