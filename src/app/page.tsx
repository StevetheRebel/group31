import { ContactSection } from "../components/home/ContactSection";
import { Footer } from "../components/home/Footer";
import HeroSection from "../components/home/HeroSection";
import ShopSection from "../components/home/ShopSection";
import StockDashboard from "../components/home/StockDashboard";

export default function Home() {
  return (
    <section className="px-4 md:px-8 lg:px-16 py-8">
      <HeroSection />
      <ShopSection />
      <StockDashboard />
      <ContactSection />
      <Footer />
    </section>
  );
}
