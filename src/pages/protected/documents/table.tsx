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
}

export default function TableDocument({ data, loading }: Props) {
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

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Series</TableHead>
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
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.author_name}</TableCell>
                  <TableCell className="capitalize">{doc.type}</TableCell>
                  <TableCell>{doc.series}</TableCell>
                  <TableCell className="capitalize">{doc.status}</TableCell>
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
                            onClick={() => handleView(doc)}
                          >
                            <Eye className="size-4 mr-1" />
                            View
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleEdit(doc)}
                          >
                            <Pencil className="size-4 mr-1" />
                            Edit
                          </Button>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleDelete(doc)}
                          >
                            <Trash className="size-4 mr-1 text-red-600" />
                            Delete
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
