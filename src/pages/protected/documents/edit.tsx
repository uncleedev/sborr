import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "@/components/shared/file-input";

import {
  SELECT_DOCUMENT_STATUS,
  SELECT_DOCUMENT_TYPE,
} from "@/constants/select-item";
import {
  EditDocumentForm,
  editDocumentSchema,
} from "@/schemas/document-schema";

import {
  Document,
  DocumentStatus,
  DocumentType,
  DocumentUpdate,
} from "@/types/document-type";
import { useDocument } from "@/hooks/useDocument";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
}

export default function EditDocument({ open, onClose, document }: Props) {
  const { handleEditDocument } = useDocument();

  const form = useForm<EditDocumentForm>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: {
      type: document?.type || "ordinance",
      status: document?.status || "draft",
      title: document?.title || "",
      author_name: document?.author_name || "",
      series: document?.series || new Date().getFullYear().toString(),
      description: document?.description ?? "",
      file: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const selectedStatus = watch("status");

  useEffect(() => {
    if (document) {
      reset({
        type: document.type,
        status: document.status,
        title: document.title,
        author_name: document.author_name,
        series: document.series,
        description: document.description,
        approved_by: document.approved_by || "",
        approved_at: document.approved_at
          ? document.approved_at.split("T")[0]
          : "",
        file: null,
      });
    }
  }, [document, reset]);

  const onSubmit = async (data: EditDocumentForm) => {
    const { file, approved_at, ...rest } = data;

    const payload: DocumentUpdate & { approved_at?: string | null } = {
      ...rest,
      approved_at: approved_at ? new Date(approved_at).toISOString() : null,
      approved_by: data.approved_by || null,
    };

    const success = await handleEditDocument(
      document!.id,
      payload,
      file ?? undefined
    );

    if (success) {
      reset();
      onClose();
    }
  };

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Modify the details of the selected document.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 lg:space-y-4">
            {/* Document Type & Status */}
            <div className="w-full flex items-center justify-between gap-4">
              {/* Document Type */}
              <div className="w-full space-y-2">
                <Label>Document Type</Label>
                <Select
                  onValueChange={(val) => setValue("type", val as DocumentType)}
                  defaultValue={document.type}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SELECT_DOCUMENT_TYPE.map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="w-full space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue={document.status}
                  onValueChange={(val) =>
                    setValue("status", val as DocumentStatus)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SELECT_DOCUMENT_STATUS.filter(
                        (item) => item !== "in_session"
                      ).map((item, index) => (
                        <SelectItem key={index} value={item}>
                          {(
                            item.charAt(0).toUpperCase() + item.slice(1)
                          ).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* Conditional Approved Fields */}
            {["archived", "vetoed"].includes(selectedStatus) && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Approved By</Label>
                  <Input
                    {...register("approved_by")}
                    placeholder="Approved By"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Approved At</Label>
                  <Input type="date" {...register("approved_at")} />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register("title")} placeholder="Enter title" />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label>Author Name</Label>
              <Input {...register("author_name")} placeholder="Enter author" />
              {errors.author_name && (
                <p className="text-sm text-red-500">
                  {errors.author_name.message}
                </p>
              )}
            </div>

            {/* Series (Year) */}
            <div className="space-y-2">
              <Label>Series (Year)</Label>
              <Select
                defaultValue={document.series}
                onValueChange={(val) => setValue("series", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectGroup>
                    {Array.from({ length: 20 }, (_, i) => {
                      const y = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.series && (
                <p className="text-sm text-red-500">{errors.series.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Enter description"
              />
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label>Attachment</Label>

              {/* ✅ Show old file if it exists */}
              {document.file_url && (
                <div className="flex items-center justify-between rounded-md border p-3 bg-muted/40">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="truncate max-w-[200px]">
                      {document.file_name || "Attached File"}
                    </span>
                  </div>

                  <a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View File
                  </a>
                </div>
              )}

              <FileInput
                value={watch("file") ?? null}
                onFileChange={(file) => setValue("file", file)}
              />

              {errors.file && (
                <p className="text-sm text-red-500">{errors.file.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Close
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
