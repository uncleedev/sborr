import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocument } from "@/hooks/useDocument";
import { Search, FileText } from "lucide-react";
import CardDocument from "@/components/cards/card-document";

export default function LegislativePage() {
  const { documents } = useDocument();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState({
    resolution: false,
    ordinance: false,
    memorandum: false,
  });
  const [seriesFilter, setSeriesFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [activeTab] = useState<"all" | "recent">("all");

  const authors = useMemo(() => {
    const authorSet = new Set(
      documents.map((doc) => doc.author_name).filter(Boolean)
    );
    return Array.from(authorSet).sort();
  }, [documents]);

  const seriesOptions = useMemo(() => {
    return Array.from(
      new Set(documents.map((doc) => doc.series).filter(Boolean))
    ).sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    // Only archived documents are visible
    let filtered = documents.filter((doc) => doc.status === "archived");

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (doc) =>
          doc.series?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.author_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (
      typeFilter.resolution ||
      typeFilter.ordinance ||
      typeFilter.memorandum
    ) {
      filtered = filtered.filter((doc) => {
        if (typeFilter.resolution && doc.type === "resolution") return true;
        if (typeFilter.ordinance && doc.type === "ordinance") return true;
        if (typeFilter.memorandum && doc.type === "memorandum") return true;
        return false;
      });
    }

    // Series filter
    if (seriesFilter !== "all") {
      filtered = filtered.filter((doc) => doc.series === seriesFilter);
    }

    // Author filter
    if (authorFilter !== "all") {
      filtered = filtered.filter((doc) => doc.author_name === authorFilter);
    }

    // Recent tab filter
    if (activeTab === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(
        (doc) => new Date(doc.created_at) >= thirtyDaysAgo
      );
    }

    // Sort newest to oldest
    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [
    documents,
    searchQuery,
    typeFilter,
    seriesFilter,
    authorFilter,
    activeTab,
  ]);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = documents.filter((doc) => {
      const docDate = new Date(doc.created_at);
      return (
        docDate.getMonth() === now.getMonth() &&
        docDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const resolutionCount = documents.filter(
      (d) => d.type === "resolution"
    ).length;
    const ordinanceCount = documents.filter(
      (d) => d.type === "ordinance"
    ).length;
    const memorandumCount = documents.filter(
      (d) => d.type === "memorandum"
    ).length;

    const statusCounts = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: documents.length,
      ordinances: ordinanceCount,
      resolutions: resolutionCount,
      memorandums: memorandumCount,
      thisMonth,
      statusCounts,
    };
  }, [documents]);

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
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Type</h3>
                {[
                  { label: "Resolution", key: "resolution" },
                  { label: "Ordinance", key: "ordinance" },
                  { label: "Memorandum", key: "memorandum" },
                ].map(({ label, key }) => (
                  <label
                    key={key}
                    className="flex items-center mb-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(typeFilter as any)[key]}
                      onChange={(e) =>
                        setTypeFilter((prev) => ({
                          ...prev,
                          [key]: e.target.checked,
                        }))
                      }
                      className="mr-2 w-4 h-4"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {/* Series Filter */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Series</h3>
                <select
                  value={seriesFilter}
                  onChange={(e) => setSeriesFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All</option>
                  {seriesOptions.map((series) => (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Filter */}
              <div>
                <h3 className="font-semibold mb-2">Author</h3>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All</option>
                  {authors.map((author) => (
                    <option key={author} value={author}>
                      {author}
                    </option>
                  ))}
                </select>
              </div>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="min-h-screen">
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="pr-2 space-y-6">
                <div className="sticky top-0 bg-background pb-4 z-10 border-b mb-4">
                  <h1 className="text-3xl font-bold text-gray-800">
                    Legislative Documents
                  </h1>
                  <p className="text-gray-600 text-sm">
                    See all the legislative documents
                  </p>
                </div>

                {/* Document List */}
                <div className="space-y-4">
                  {filteredDocuments.length === 0 ? (
                    <Card className="p-8 text-center">
                      <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No documents found</p>
                    </Card>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <CardDocument key={doc.id} data={doc} />
                    ))
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Statistics Sidebar */}
          <aside className="hidden xl:block">
            <Card className="p-6 shadow-md sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>

              {/* Total Documents */}
              <div className="rounded-lg p-6 mb-6 text-center">
                <div className="text-4xl font-bold text-teal-900">
                  {stats.total.toLocaleString()}
                </div>
                <div className="text-sm text-teal-700 mt-1">
                  total documents
                </div>
              </div>

              {/* Document Types */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ordinances</span>
                  <span className="font-bold text-gray-900">
                    {stats.ordinances}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Resolutions</span>
                  <span className="font-bold text-gray-900">
                    {stats.resolutions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Memorandums</span>
                  <span className="font-bold text-gray-900">
                    {stats.memorandums}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">This Month</span>
                  <span className="font-bold text-teal-700">
                    +{stats.thisMonth}
                  </span>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold mb-3">Status</h3>
                <div className="space-y-3">
                  {Object.entries(stats.statusCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([status, count]) => (
                      <div
                        key={status}
                        className="flex justify-between items-center"
                      >
                        <span className="text-gray-700 capitalize text-sm">
                          {status.replace("_", " ")}
                        </span>
                        <span className="font-bold text-gray-900">{count}</span>
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
