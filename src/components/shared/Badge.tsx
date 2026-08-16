type BadgeVariant = "new" | "trending" | "hot" | "limited" | "sold";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

export default function Badge({ variant, children }: BadgeProps) {
  const variantStyles = {
    new: "bg-green-500 text-white",
    trending: "bg-red-600 text-white",
    hot: "bg-orange-500 text-white",
    limited: "bg-purple-500 text-white",
    sold: "bg-gray-600 text-gray-300",
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}