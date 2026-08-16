import Image from "next/image";
import Button from "../shared/Button";
import { Zap } from "lucide-react";

export default function HeroSection() {
  const heroImage = "/shoes/nike-air-max-270.jpg";

  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden xl:min-h-auto ">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-red-500/10 rounded-full px-4 py-1.5 text-red-500 font-bold text-sm uppercase tracking-wider">
              New drops every week
            </div>

            <h1 className="font-sans font-extrabold text-white text-5xl md:text-7xl lg:text-6xl leading-none tracking-wider ">
              STEP INTO <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-orange-500 [-webkit-text-stroke:2px_#E8192C]">
                YOUR VIBE
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-lg mx-auto lg:mx-0">
              Fresh kicks. Big energy.
              <br />
              Kenya&apos;s freshest footwear, delivered to your door.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button href="#shop" variant="primary" size="lg">
                Shop Now
              </Button>
              <Button href="#shop" variant="outline" size="lg">
                View Collection
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-6 pt-4 border-t border-gray-800 lg:gap-8">
              <div className="flex flex-col items-center gap-1">
                <p className="font-display text-2xl text-red-500">8</p>
                <p className="text-xs text-gray-200 uppercase tracking-wider">
                  Products
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="font-display text-2xl text-red-500">KES</p>
                <p className="text-xs text-gray-200 uppercase tracking-wider">
                  Kenya Shillings
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="text-red-500" size={30} strokeWidth={1.5} />
                <p className="text-xs text-gray-200 uppercase tracking-wider">
                  Fast Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:p-12">
            <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
              {/* Base layer: Darkened image (background state) */}
              <Image
                src={heroImage}
                alt="Featured shoe"
                fill
                className="object-cover"
                priority
              />

              {/* Floating badge */}
              <div className="absolute bottom-4 left-4 bg-orange-500/50 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg animate-float">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider  text-white">
                  Trending Now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
