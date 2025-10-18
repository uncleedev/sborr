import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import { Session } from "@/types/session-type";
import ViewSession from "./view";
import EditSession from "./edit";
import DeleteSession from "./delete";
import { formatDateWithOrdinal } from "@/lib/utils";

interface Props {
  data: Session[];
  loading: boolean;
}

export default function TableSession({ data, loading }: Props) {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleView = (session: Session) => {
    setSelectedSession(session);
    setViewOpen(true);
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setEditOpen(true);
  };

  const handleDelete = (session: Session) => {
    setSelectedSession(session);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((__, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No sessions found.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((session) => (
              <TableRow key={session.id}>
                <TableCell className="capitalize">{session.type}</TableCell>
                <TableCell>
                  {formatDateWithOrdinal(session.scheduled_at)}
                </TableCell>
                <TableCell>
                  {new Date(session.scheduled_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>{session.venue || "-"}</TableCell>
                <TableCell className="capitalize">{session.status}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleView(session)}
                        >
                          <Eye className="size-4 mr-1" /> View
                        </Button>
                      </DropdownMenuItem>

                      {session.status === "draft" && (
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleEdit(session)}
                          >
                            <Pencil className="size-4 mr-1" /> Edit
                          </Button>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleDelete(session)}
                        >
                          <Trash className="size-4 mr-1 text-red-600" /> Delete
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!loading && totalPages > 1 && (
        <Pagination className="flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* View, Edit, Delete Modals */}
      <ViewSession
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        session={selectedSession}
      />
      <EditSession
        open={editOpen}
        onClose={() => setEditOpen(false)}
        session={selectedSession}
      />
      <DeleteSession
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        session={selectedSession}
      />
    </div>
  );
}
