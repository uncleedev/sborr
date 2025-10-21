import CardDocument from "@/components/cards/card-document";
import HeroSection from "@/components/home/hero-section";
import ImpactSection from "@/components/home/impact-section";
import { useDocument } from "@/hooks/useDocument";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const { archivedDocuments, loading } = useDocument();

  const recentDocuments = [...archivedDocuments]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  return (
    <div>
      <HeroSection />
      <ImpactSection />

      <section
        className="flex flex-col items-center gap-6 p-6 md:p-8 lg:p-12"
        id="legislative"
      >
        <header className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Recent Legislative Updates
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Stay up-to-date with the latest ordinances and resolutions passed by
            the Sangguniang Bayan.
          </p>
        </header>

        {loading && (
          <p className="text-muted-foreground">Loading documents...</p>
        )}

        {!loading && recentDocuments.length === 0 && (
          <p className="text-muted-foreground">
            No archived documents available.
          </p>
        )}

        <div className="w-full flex flex-col gap-6">
          {recentDocuments.map((doc) => (
            <CardDocument key={doc.id} data={doc} />
          ))}
        </div>

        {!loading && archivedDocuments.length > 3 && (
          <Button
            className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-6 py-2"
            onClick={() => navigate("/legislatives")}
          >
            View All Documents
          </Button>
        )}
      </section>
    </div>
  );
}
