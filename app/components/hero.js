import React from 'react';
import Image from 'next/image';
import Background from '@/public/background.jpg';

function Hero({ children }) {
  return (
    <div className="relative min-h-screen">
      <Image
        src={Background}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}

export default Hero;