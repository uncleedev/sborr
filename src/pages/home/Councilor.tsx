import { useUser } from "@/hooks/useUser";
import { Card } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react"; // 👈 Import a fallback icon

export default function CouncilorPage() {
  const { councilors, loading } = useUser();

  const skeletons = Array.from({ length: 8 });

  return (
    <section className="py-12 bg-gray-50">
      <div className="screen">
        <header className="text-center space-y-2 mb-12">
          <h1 className="text-3xl font-bold text-primary">
            Montalban Municipal Councilors
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Meet the members of the Sangguniang Bayan of Montalban.
          </p>
        </header>

        {loading ? (
          // Skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {skeletons.map((_, index) => (
              <Card
                key={index}
                className="flex flex-col gap-4 items-center text-center shadow rounded-xl bg-white animate-pulse"
              >
                <div className="w-32 h-32 bg-gray-200 rounded-full border border-gray-300" />
                <div className="h-6 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-28 bg-gray-200 rounded" />
              </Card>
            ))}
          </div>
        ) : councilors.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No councilors found.
          </p>
        ) : (
          // Councilor cards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {councilors.map((councilor) => (
              <Card
                key={councilor.id}
                className="flex flex-col gap-4 items-center p-6 text-center shadow rounded-xl bg-white
                           transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="w-32 h-32 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 overflow-hidden">
                  {councilor.avatar_url ? (
                    <img
                      src={councilor.avatar_url}
                      alt={`${councilor.firstname} ${councilor.lastname}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {councilor.firstname} {councilor.lastname}
                </h3>
                <p className="text-sm text-blue-600 capitalize">
                  {councilor.role.replace("_", " ")}
                </p>

                {councilor.email && (
                  <p className="text-sm text-gray-500 truncate">
                    <a
                      href={`mailto:${councilor.email}`}
                      className="hover:underline"
                    >
                      {councilor.email}
                    </a>
                  </p>
                )}

                {councilor.bio && (
                  <p className="text-sm text-muted-foreground">
                    {councilor.bio}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
