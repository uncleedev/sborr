import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "@/hooks/useSession";
import { Search, CalendarDays } from "lucide-react";

export default function SessionsPage() {
  const { sessions, loading } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<{
    draft: boolean;
    scheduled: boolean;
    ongoing: boolean;
    completed: boolean;
  }>({
    draft: false,
    scheduled: false,
    ongoing: false,
    completed: false,
  });

  const [typeFilter, setTypeFilter] = useState<{
    regular: boolean;
    special: boolean;
  }>({
    regular: false,
    special: false,
  });

  const filteredSessions = useMemo(() => {
    let filtered = [...sessions];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (
      statusFilter.draft ||
      statusFilter.scheduled ||
      statusFilter.ongoing ||
      statusFilter.completed
    ) {
      filtered = filtered.filter((s) => statusFilter[s.status]);
    }

    // Type filter
    if (typeFilter.regular || typeFilter.special) {
      filtered = filtered.filter((s) => typeFilter[s.type]);
    }

    // Sort: most recent first
    return filtered.sort(
      (a, b) =>
        new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime()
    );
  }, [sessions, searchQuery, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const statusCounts = sessions.reduce((acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeCounts = sessions.reduce((acc, s) => {
      acc[s.type] = (acc[s.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: sessions.length,
      statusCounts,
      typeCounts,
    };
  }, [sessions]);

  return (
    <section className="pt-16 pb-10">
      <div className="screen">
        <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr_300px] lg:grid-cols-[240px_1fr] gap-6 items-start">
          {/* Filter Sidebar */}
          <aside className="hidden lg:block">
            <Card className="shadow-md sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto p-4">
              <h2 className="text-xl font-bold mb-4">Filter</h2>

              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search sessions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Status</h3>
                {["draft", "scheduled", "ongoing", "completed"].map(
                  (status) => (
                    <label key={status} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={(statusFilter as any)[status]}
                        onChange={(e) =>
                          setStatusFilter((prev) => ({
                            ...prev,
                            [status]: e.target.checked,
                          }))
                        }
                        className="mr-2 w-4 h-4"
                      />
                      <span className="capitalize">{status}</span>
                    </label>
                  )
                )}
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="font-semibold mb-2">Type</h3>
                {["regular", "special"].map((type) => (
                  <label key={type} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={(typeFilter as any)[type]}
                      onChange={(e) =>
                        setTypeFilter((prev) => ({
                          ...prev,
                          [type]: e.target.checked,
                        }))
                      }
                      className="mr-2 w-4 h-4"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="min-h-screen">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="pr-2 space-y-6">
                <div className="sticky top-0 bg-background pb-4 z-10 border-b mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">
                    Legislative Sessions
                  </h1>
                  <p className="text-gray-600 text-sm">
                    View all municipal legislative sessions
                  </p>
                </div>

                {/* Session List */}
                {loading ? (
                  <p className="text-center text-gray-500">
                    Loading sessions...
                  </p>
                ) : filteredSessions.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CalendarDays className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No sessions found</p>
                  </Card>
                ) : (
                  filteredSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-5 border-l-4 hover:border-l-teal-600 transition-all"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold capitalize">
                            {session.type} session
                          </h2>
                          <p className="text-sm text-gray-500">
                            {new Date(session.scheduled_at).toLocaleString()}
                          </p>
                          {session.venue && (
                            <p className="text-sm text-gray-700 mt-1">
                              Venue: {session.venue}
                            </p>
                          )}
                          {session.description && (
                            <p className="text-gray-600 mt-2">
                              {session.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            session.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : session.status === "ongoing"
                              ? "bg-yellow-100 text-yellow-800"
                              : session.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Statistics Sidebar */}
          <aside className="hidden xl:block">
            <Card className="p-6 shadow-md sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>

              {/* Total */}
              <div className="rounded-lg p-6 mb-6 text-center">
                <div className="text-4xl font-bold text-teal-900">
                  {stats.total}
                </div>
                <div className="text-sm text-teal-700 mt-1">total sessions</div>
              </div>

              {/* Status Breakdown */}
              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold mb-3">By Status</h3>
                <div className="space-y-2">
                  {Object.entries(stats.statusCounts).map(([key, count]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type Breakdown */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">By Type</h3>
                <div className="space-y-2">
                  {Object.entries(stats.typeCounts).map(([key, count]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}
