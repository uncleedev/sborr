import { useState } from "react";
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
  DialogTrigger,
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
import { DialogTitle } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";

import {
  SELECT_DOCUMENT_STATUS,
  SELECT_DOCUMENT_TYPE,
} from "@/constants/select-item";
import { FileInput } from "@/components/shared/file-input";
import { AddDocumentForm, addDocumentSchema } from "@/schemas/document-schema";
import { DocumentStatus, DocumentType } from "@/types/document-type";
import { useDocument } from "@/hooks/useDocument";

export default function AddDocument() {
  const [status, setStatus] = useState("");
  const { handleAddDocument } = useDocument();

  const form = useForm<AddDocumentForm>({
    resolver: zodResolver(addDocumentSchema),
    defaultValues: {
      type: "ordinance",
      status: "draft",
      title: "",
      author_name: "",
      series: new Date().getFullYear().toString(),
      description: "",
      file: null,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const selectedStatus = watch("status");

  const onSubmit = async (data: AddDocumentForm) => {
    const { file, ...payload } = data;
    const success = await handleAddDocument(payload, file ?? undefined);
    if (success) reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span className="font-semibold hidden md:inline">Add Document</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6"
        >
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>Add new legislative document</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Document Type & Status */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <Label>Document Type</Label>
                <Select
                  onValueChange={(val) => setValue("type", val as DocumentType)}
                  defaultValue=""
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

              <div className="w-full md:w-1/2 space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(val) => {
                    setStatus(val);
                    setValue("status", val as DocumentStatus);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {SELECT_DOCUMENT_STATUS.map((item, index) => (
                        <SelectItem key={index} value={item} className="">
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 space-y-2">
                  <Label>Approved By</Label>
                  <Input
                    {...register("approved_by")}
                    placeholder="Approved By"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-2">
                  <Label>Approved At</Label>
                  <Input type="date" {...register("approved_at")} />
                </div>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register("title")} placeholder="Enter the title" />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label>Author Name</Label>
              <Input
                {...register("author_name")}
                placeholder="Enter the name"
              />
              {errors.author_name && (
                <p className="text-sm text-red-500">
                  {errors.author_name.message}
                </p>
              )}
            </div>

            {/* Series */}
            <div className="space-y-2">
              <Label>Series (Year)</Label>
              <Select
                defaultValue={new Date().getFullYear().toString()}
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
                placeholder="Enter the description"
              />
            </div>

            {/* File Input */}
            <div className="space-y-2">
              <Label>Attachment</Label>
              <FileInput
                value={watch("file")}
                onFileChange={(file) => setValue("file", file)}
              />
              {errors.file && (
                <p className="text-sm text-red-500">{errors.file.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Close
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
