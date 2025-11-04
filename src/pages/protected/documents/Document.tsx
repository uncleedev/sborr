import { useState, useMemo } from "react";
import { useDocument } from "@/hooks/useDocument";
import AddDocument from "./add";
import TableDocument from "./table";
import { Card } from "@/components/ui/card";
import Searchbar from "@/components/shared/searchbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SELECT_DOCUMENT_STATUS,
  SELECT_DOCUMENT_TYPE,
} from "@/constants/select-item";

export default function DocumentPage() {
  const { documents, loading } = useDocument();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSeries, setSelectedSeries] = useState("all");

  const uniqueSeries = useMemo(() => {
    const seriesSet = new Set(
      documents
        .map((doc) => doc.series)
        .filter((series) => series && series.trim() !== "")
    );
    return Array.from(seriesSet).sort();
  }, [documents]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.author_name.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedType === "all" || doc.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || doc.status === selectedStatus;
      const matchesSeries =
        selectedSeries === "all" || doc.series === selectedSeries;

      return matchesSearch && matchesType && matchesStatus && matchesSeries;
    });
  }, [documents, search, selectedType, selectedStatus, selectedSeries]);

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <header className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">Document Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage legislative documents.
          </p>
        </div>
        <AddDocument />
      </header>

      {/* Filters & Table */}
      <Card className="p-4 flex flex-col gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:place-self-end lg:w-2/3 items-stretch sm:items-center">
          <Searchbar value={search} onChange={setSearch} />

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                {SELECT_DOCUMENT_TYPE.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedSeries} onValueChange={setSelectedSeries}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Series" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Series</SelectItem>
                {uniqueSeries.map((series, index) => (
                  <SelectItem key={index} value={series}>
                    {series}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                {SELECT_DOCUMENT_STATUS.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <TableDocument
          data={filteredDocuments}
          loading={loading}
          searchTerm={search}
        />
      </Card>
    </section>
  );
}
