import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import AccreditationsBar from "@/components/home/AccreditationsBar";
import StatsBar from "@/components/home/StatsBar";
import CoreFunctions from "@/components/home/CoreFunctions";
import Specializations from "@/components/home/Specializations";
import NepalEquivalenceBanner from "@/components/home/NepalEquivalenceBanner";
import Notifications from "@/components/home/Notifications";
import KeyGuidelines from "@/components/home/KeyGuidelines";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <AccreditationsBar />
      <StatsBar />
      <CoreFunctions />
      <Specializations />
      <NepalEquivalenceBanner />
      <Notifications />
      <KeyGuidelines />

      {/* Footer */}
      <Footer />
    </main>
  );
}

