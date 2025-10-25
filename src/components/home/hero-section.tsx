import { Button } from "@/components/ui/button";
import { AlarmClock, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import CardInfo from "./card-info";

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-[85vh] sm:min-h-[90vh] lg:h-[90vh] bg-[url('/hero.png')] bg-cover bg-center bg-no-repeat overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/60" />

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] leading-tight">
              <span className="block">Sangguniang Bayan</span>
              <span className="block">Ordinance & Resolution</span>
              <span className="block">Repository</span>
            </h1>

            <p className="text-gray-100 text-lg sm:text-xl lg:text-2xl font-medium max-w-3xl mx-auto drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)]">
              Stay informed with the latest municipal legislative documents to
              ensure transparency and accountability in our local governance.
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="px-8 py-4 text-lg rounded-xl shadow-lg bg-teal-600 hover:bg-teal-700 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Link to="/legislatives">View all legislatives</Link>
            </Button>
          </div>

          {/* Info Cards */}
          <div className="pt-8 lg:pt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <CardInfo
                icon={MapPin}
                title="Location"
                description="Rodriguez, Rizal"
              />
              <CardInfo
                icon={Phone}
                title="Hotline"
                description="(02) 112233"
              />
              <CardInfo
                icon={AlarmClock}
                title="Office Hours"
                description="8AM – 10PM"
                className="sm:col-span-2 lg:col-span-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator (Mobile Only) */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 sm:hidden">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-teal-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-teal-400 rounded-full mt-2"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
