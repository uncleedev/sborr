import { Card } from "@/components/ui/card";
import AddSession from "./add";
import Searchbar from "@/components/shared/searchbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import {
  SELECT_SESSION_STATUS,
  SELECT_SESSION_TYPE,
} from "@/constants/select-item";
import { useSession } from "@/hooks/useSession";
import TableSession from "./table"; // import your session table

export default function SessionPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { sessions, loading } = useSession();

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const formattedDate = new Date(session.scheduled_at).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      );

      const matchesSearch =
        formattedDate.toLowerCase().includes(search.toLowerCase()) ||
        session.venue?.toLowerCase().includes(search.toLowerCase()) ||
        session.description?.toLowerCase().includes(search.toLowerCase()) ||
        session.type.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        selectedType === "all" || session.type === selectedType;
      const matchesStatus =
        selectedStatus === "all" || session.status === selectedStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [sessions, search, selectedType, selectedStatus]);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="">Session Management</h3>
          <p>Manage session schedule.</p>
        </div>
        <AddSession />
      </header>

      <Card className="p-4 flex flex-col gap-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:place-self-end lg:w-1/2 items-stretch sm:items-center">
          <Searchbar value={search} onChange={setSearch} />

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Types</SelectItem>
                {SELECT_SESSION_TYPE.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                {SELECT_SESSION_STATUS.map((item, index) => (
                  <SelectItem key={index} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <TableSession data={filteredSessions} loading={loading} />
      </Card>
    </section>
  );
}
