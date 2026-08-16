"use client";

import { Home, LayoutDashboard, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  route: string;
  icon: LucideIcon;
};

const navList: NavItem[] = [
  {
    label: "Home",
    route: "/",
    icon: Home,
  },
  {
    label: "Dashboard",
    route: "/dashboard",
    icon: LayoutDashboard,
  },
];

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <header className="fixed z-100 w-full max-w-350 px-6 py-3 flex items-center justify-between bg-white/10 backdrop-saturate-50 backdrop-blur-sm rounded-b-xl">
      {/* Logo */}
      <Link href="/" className="relative w-12 h-12 md:w-14 md:h-14 shrink-0">
        <Image
          src="/northstar-logo.png"
          alt="Northstar Logo"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Navigation Links */}
      <nav>
        <ul className="flex items-center gap-1 md:gap-2">
          {navList.map((item) => {
            const isActive = pathname === item.route;
            return (
              <li key={item.route}>
                <Link
                  href={item.route}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? " text-white"
                        : "text-white/50 hover:text-white "
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}