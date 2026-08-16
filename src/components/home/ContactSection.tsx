import { Mail, Phone, PinIcon } from "lucide-react";
import SectionHeader from "../shared/SectionHeader";
import { BsFacebook, BsInstagram, BsTiktok, BsTwitterX, BsWhatsapp } from "react-icons/bs";

export function ContactSection() {
  return (
    <section className="py-20 bg-gray-900" id="contact">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Contact Us"
          subtitle="Questions? Orders? We're right here."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Phone */}
          <a
            href="tel:+254700000000"
            className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-red-500 transition-all hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-2xl mb-3">
              <Phone size={32} className="text-red-500" />
            </div>
            <h3 className="font-bold text-white">Call Us</h3>
            <p className="text-gray-400 text-sm">+254 700 000 000</p>
            <p className="text-gray-600 text-xs mt-1">Mon–Sat, 8am–6pm EAT</p>
            <span className="inline-block mt-3 text-red-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Tap to Call →
            </span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/254700000000?text=Hi%20NorthShoes!%20I%27d%20like%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-green-500 transition-all hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl mb-3">
              <BsWhatsapp className="text-green-500" size={32} />
            </div>
            <h3 className="font-bold text-white">WhatsApp</h3>
            <p className="text-gray-400 text-sm">+254 700 000 000</p>
            <p className="text-gray-600 text-xs mt-1">
              Fast responses, 7 days a week
            </p>
            <span className="inline-block mt-3 text-green-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Chat Now →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:hello@northshoes.co.ke"
            className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition-all hover:-translate-y-2 group"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-2xl mb-3">
            <Mail size={32} className="text-blue-500" />
            </div>
            <h3 className="font-bold text-white">Email Us</h3>
            <p className="text-gray-400 text-sm">hello@northshoes.co.ke</p>
            <p className="text-gray-600 text-xs mt-1">
              We reply within 24 hours
            </p>
            <span className="inline-block mt-3 text-blue-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Send Email →
            </span>
          </a>

          {/* Location */}
          <div className="bg-black rounded-2xl p-6 border border-gray-800 hover:border-orange-500 transition-all hover:-translate-y-2 group">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-2xl mb-3">
              <PinIcon size={32} className="text-orange-500" />
            </div>
            <h3 className="font-bold text-white">Visit Us</h3>
            <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
            <p className="text-gray-600 text-xs mt-1">
              Westlands — Placeholder Address
            </p>
            <span className="inline-block mt-3 text-orange-500 font-bold text-sm group-hover:translate-x-1 transition-transform">
              Get Directions →
            </span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col flex-wrap items-center justify-center gap-4 mt-12 pt-8 border-t border-gray-800">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-wider ">
            Follow us:
          </span>
         <div className="flex gap-4 w-full flex-wrap items-center justify-center">
           <a
            href="#"
            className="text-gray-400 hover:text-red-500 transition-colors flex gap-1 items-center"
          >
            <BsInstagram size={16}/> Instagram
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-red-500 transition-colors flex gap-1 items-center"
          >
            <BsTiktok size={16}/> TikTok
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-red-500 transition-colors flex gap-1 items-center"
          >
            <BsFacebook size={16}/> Facebook
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-red-500 transition-colors flex gap-1 items-center"
          >
            <BsTwitterX size={16}/> Twitter
          </a>
         </div>
        </div>
      </div>
    </section>
  );
}
