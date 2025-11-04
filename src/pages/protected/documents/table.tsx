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
import { Document } from "@/types/document-type";
import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ViewDocument from "./view";
import EditDocument from "./edit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";
import DeleteDocument from "./delete";

interface Props {
  data: Document[];
  loading: boolean;
  searchTerm?: string;
}

export default function TableDocument({
  data,
  loading,
  searchTerm = "",
}: Props) {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  }, [data, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleView = (doc: Document) => {
    setSelectedDoc(doc);
    setViewOpen(true);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDoc(doc);
    setEditOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setSelectedDoc(doc);
    setDeleteOpen(true);
  };

  // Function to highlight matching text
  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <mark key={index} className="bg-yellow-300 font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%] min-w-[300px]">Title</TableHead>
              <TableHead className="w-[15%]">Author</TableHead>
              <TableHead className="w-[10%]">Type</TableHead>
              <TableHead className="w-[10%]">Series</TableHead>
              <TableHead className="w-[10%]">Status</TableHead>
              <TableHead className="w-[15%]">Actions</TableHead>
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
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((doc) => {
                const isLocked = doc.status === "in_session";

                return (
                  <TableRow key={doc.id}>
                    <TableCell className="break-words whitespace-normal align-top max-w-[400px]">
                      {highlightText(doc.title, searchTerm)}
                    </TableCell>
                    <TableCell className="align-top">
                      {highlightText(doc.author_name, searchTerm)}
                    </TableCell>
                    <TableCell className="capitalize align-top">
                      {doc.type}
                    </TableCell>
                    <TableCell className="align-top">{doc.series}</TableCell>
                    <TableCell className="align-top">
                      {doc.status.replace("_", " ")}
                    </TableCell>
                    <TableCell className="align-top">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* View */}
                          <DropdownMenuItem asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleView(doc)}
                            >
                              <Eye className="size-4 mr-1" />
                              View
                            </Button>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild disabled={isLocked}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => handleEdit(doc)}
                              disabled={isLocked}
                            >
                              <Pencil className="size-4 mr-1" />
                              Edit
                            </Button>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild disabled={isLocked}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start "
                              onClick={() => handleDelete(doc)}
                              disabled={isLocked}
                            >
                              <Trash className="size-4 mr-1 text-red-600" />
                              Delete
                            </Button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

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

      {/* View & Edit Modals */}
      <ViewDocument
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        document={selectedDoc}
      />

      <EditDocument
        open={editOpen}
        onClose={() => setEditOpen(false)}
        document={selectedDoc}
      />

      <DeleteDocument
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        document={selectedDoc}
      />
    </div>
  );
}
