import { useDocument } from "@/hooks/useDocument";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@/hooks/useUser";
import { Calendar, File, Users } from "lucide-react";

export default function ImpactSection() {
  const { ordinanceDocuments } = useDocument();
  const { completedSession } = useSession();
  const { councilors } = useUser();

  const stats = [
    {
      icon: Users,
      value: councilors.length,
      title: "Active Councilors",
      subtitle: "Serving the community",
    },
    {
      icon: File,
      value: ordinanceDocuments.length,
      title: "Ordinances Passed",
      subtitle: "Serving the community",
    },
    {
      icon: Calendar,
      value: completedSession.length,
      title: "Sessions Held",
      subtitle: "Serving the community",
    },
  ];

  return (
    <section className="bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 p-6 md:p-10 lg:p-16">
        {/* Header */}
        <header className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-semibold">Our Impact</h2>
          <p className="text-muted text-sm md:text-base">
            Serving the community with dedication and transparency
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-4xl text-center">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 rounded-lg"
              >
                <div className="bg-primary-foreground/10 p-3 rounded-full">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-bold">{item.value}</h3>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-primary-foreground/70">
                  {item.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
