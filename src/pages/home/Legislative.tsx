import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDocument } from "@/hooks/useDocument";
import { useUser } from "@/hooks/useUser";
import { Search, FileText, Calendar } from "lucide-react";
import ViewDocument from "@/components/home/view-document";

export default function LegislativePage() {
  const { documents, ordinanceDocuments } = useDocument();
  const { getUserName } = useUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState({
    resolution: false,
    ordinance: false,
  });
  const [yearFilter, setYearFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [activeTab] = useState<"all" | "recent">("all");

  // Get unique years and authors
  const years = useMemo(() => {
    const yearSet = new Set(
      documents.map((doc) => new Date(doc.created_at).getFullYear())
    );
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [documents]);

  const authors = useMemo(() => {
    const authorSet = new Set(
      documents.map((doc) => doc.author_name).filter(Boolean)
    );
    return Array.from(authorSet).sort();
  }, [documents]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents;

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
    if (typeFilter.resolution || typeFilter.ordinance) {
      filtered = filtered.filter((doc) => {
        if (typeFilter.resolution && doc.type === "resolution") return true;
        if (typeFilter.ordinance && doc.type === "ordinance") return true;
        return false;
      });
    }

    // Year filter
    if (yearFilter !== "all") {
      filtered = filtered.filter(
        (doc) => new Date(doc.created_at).getFullYear() === parseInt(yearFilter)
      );
    }

    // Author filter
    if (authorFilter !== "all") {
      filtered = filtered.filter((doc) => doc.author_name === authorFilter);
    }

    // Tab filter
    if (activeTab === "recent") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(
        (doc) => new Date(doc.created_at) >= thirtyDaysAgo
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [documents, searchQuery, typeFilter, yearFilter, authorFilter, activeTab]);

  // Calculate statistics
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
    const memorandumCount = documents.filter(
      (d) => d.type === "memorandum"
    ).length;

    // Status breakdown
    const statusCounts = documents.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: documents.length,
      ordinances: ordinanceDocuments.length,
      resolutions: resolutionCount,
      memorandums: memorandumCount,
      thisMonth,
      statusCounts,
    };
  }, [documents, ordinanceDocuments]);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: "Draft",
      for_review: "RNF",
      in_session: "In Session",
      approved: "Approved",
      rejected: "Rejected",
      archived: "Archived",
      vetoed: "Vetoed",
    };
    return labels[status] || status.toUpperCase();
  };

  return (
    <section className="min-h-screen">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filter Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Filter</h2>

              {/* Search */}
              <div className="mb-6">
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
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Type</h3>
                <label className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={typeFilter.resolution}
                    onChange={(e) =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        resolution: e.target.checked,
                      }))
                    }
                    className="mr-2 w-4 h-4"
                  />
                  <span>Resolution</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={typeFilter.ordinance}
                    onChange={(e) =>
                      setTypeFilter((prev) => ({
                        ...prev,
                        ordinance: e.target.checked,
                      }))
                    }
                    className="mr-2 w-4 h-4"
                  />
                  <span>Ordinance</span>
                </label>
              </div>

              {/* Year Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Year</h3>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="all">All</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
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
          <div className="lg:col-span-3">
            <ScrollArea className="h-screen">
              <div className="pr-4">
                <div className=" sticky top-0 bg-background pb-4 z-10">
                  <h1 className="text-3xl font-bold text-gray-800">
                    Legislative Documents
                  </h1>
                  <p>see all the legislative documents</p>
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
                      <Card
                        key={doc.id}
                        className="p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-lg">
                                No. {doc.series || "N/A"}
                              </span>
                              <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium capitalize">
                                {doc.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {getStatusLabel(doc.status)}
                            </p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 font-medium">
                          {doc.title}
                        </p>

                        <p className="text-sm text-gray-600 mb-4">
                          {doc.author_name || getUserName(doc.created_by)}
                        </p>

                        <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {doc.approved_at
                              ? `Passed: ${new Date(
                                  doc.approved_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}`
                              : `Created: ${new Date(
                                  doc.created_at
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}`}
                          </span>
                        </div>

                        <div className="flex gap-3">
                          <ViewDocument document={doc} />
                          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                            download pdf
                          </button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* Load More */}
                {filteredDocuments.length > 0 && (
                  <div className="text-center mt-8 mb-6">
                    <button className="px-6 py-3 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors font-medium">
                      More Documents
                    </button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Statistics Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Statistics</h2>

              {/* Total Documents */}
              <div className="bg-gradient-to-br from-teal-100 to-emerald-100 rounded-lg p-6 mb-6 text-center">
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

              {/* Recent Activities */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Recent Activities</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    {stats.thisMonth} new document
                    {stats.thisMonth !== 1 ? "s" : ""} added today
                  </p>
                  <p>{Math.floor(stats.total * 0.12)} documents viewed today</p>
                  <p>{Math.floor(stats.total * 0.06)} documents downloaded</p>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
}
