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
import { SELECT_STATUS, SELECT_TYPE } from "@/constants/select-item";

export default function DocumentPage() {
  const { documents, handleAddDocument, loading } = useDocument();

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter logic
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.author_name.toLowerCase().includes(search.toLowerCase());

      const matchesType = selectedType === "all" || doc.type === selectedType;

      const matchesStatus =
        selectedStatus === "all" || doc.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [documents, search, selectedType, selectedStatus]);

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h3 className="">Document Management</h3>
          <p>Manage legislative documents.</p>
        </div>
        <AddDocument handleAddDocument={handleAddDocument} />
      </header>

      <Card className="p-4 flex flex-col gap-4">
        {/* FILTERS */}
        <div className="w-1/2 flex items-center place-self-end  gap-4">
          <Searchbar value={search} onChange={setSearch} />

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                {SELECT_TYPE.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                {SELECT_STATUS.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* TABLE */}
        <TableDocument data={filteredDocuments} loading={loading} />
      </Card>
    </section>
  );
}
