interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeaderProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={`mb-12 ${alignClasses[align]}`}>
      {eyebrow && (
        <span className="inline-block font-sans text-red-500 text-xs font-bold uppercase tracking-widest mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-sans font-extrabold text-3xl md:text-4xl lg:text-5xl text-white mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}