import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/northstar-logo.png" // Adjust to your logo path
              alt="NorthShoes"
              width={120}
              height={40}
              className="h-9 w-auto"
            />
            <span className="text-gray-500 text-sm">Fresh kicks. Big energy.</span>
          </div>
          <div className="flex gap-8">
            <Link href="#home" className="text-gray-400 hover:text-red-500 text-sm">
              Home
            </Link>
            <Link href="#shop" className="text-gray-400 hover:text-red-500 text-sm">
              Shop
            </Link>
            <Link href="#stock" className="text-gray-400 hover:text-red-500 text-sm">
              Stock
            </Link>
            <Link href="#contact" className="text-gray-400 hover:text-red-500 text-sm">
              Contact
            </Link>
          </div>
        </div>
        <p className="text-center text-gray-700 text-xs mt-8 pt-4 border-t border-gray-800">
          © 2026 NorthShoes. All rights reserved. · Kenya
        </p>
      </div>
    </footer>
  );
}