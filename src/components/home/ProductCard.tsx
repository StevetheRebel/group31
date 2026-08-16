import Image from "next/image";
import Badge from "./../shared/Badge";
import { InventoryItem } from "@/src/types/inventory";
import StockBar from "../shared/StockBar";


interface ProductCardProps {
  product: InventoryItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.stock_quantity === 0;

  // Determine badge variant
  const badgeVariant = isSoldOut
    ? "sold"
    : product.name.includes("Air")
      ? "hot"
      : "trending";
  const badgeText = isSoldOut
    ? "Sold Out"
    : product.name.includes("Air")
      ? "Hot"
      : "Trending";

  // Fallback image if product.image is missing
  const imageSrc = product.image || "/placeholder-image.png";

  return (
    <article className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 transition-all duration-300 hover:-translate-y-2 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10">
      {/* Image */}
      <div className="relative w-full h-56 bg-gray-800 overflow-hidden">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <span className="text-xs font-sans font-bold uppercase tracking-wider text-red-500">
          {product.category}
        </span>
        <h3 className="text-xl font-sans font-extrabold text-white leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-2xl text-red-500">
          KES {product.price.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400 line-clamp-2">
          {product.description}
        </p>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          {product.available_sizes.slice(0, 6).map((size) => (
            <span
              key={size}
              className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-semibold text-gray-300"
            >
              {size}
            </span>
          ))}
          {product.available_sizes.length > 6 && (
            <span className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs font-semibold text-gray-400">
              +{product.available_sizes.length - 6}
            </span>
          )}
        </div>

        {/* Stock */}
        <StockBar stock={product.stock_quantity} maxStock={20} />

        {/* Button */}
        <button
          disabled={isSoldOut}
          className={`w-full mt-2 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all ${
            isSoldOut
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
          }`}
        >
          {isSoldOut ? "Out of Stock" : "Order Now →"}
        </button>
      </div>
    </article>
  );
}