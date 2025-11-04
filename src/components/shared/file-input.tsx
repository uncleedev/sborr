import { useState, useEffect } from "react";
import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { formatBytes } from "@/hooks/useFileUpload";

type FileInputProps = {
  value: File | null;
  onFileChange: (file: File | null) => void;
  maxSize?: number;
};

export function FileInput({
  value,
  onFileChange,
  maxSize = 10 * 1024 * 1024,
}: FileInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= maxSize) {
      onFileChange(file);
      setError(null);
    } else if (file) {
      setError(`File exceeds max size of ${formatBytes(maxSize)}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size <= maxSize) {
      onFileChange(file);
      setError(null);
    } else if (file) {
      setError(`File exceeds max size of ${formatBytes(maxSize)}`);
    }
  };

  const removeFile = () => onFileChange(null);

  // keep internal file state in sync with value
  const [internalFile, setInternalFile] = useState<File | null>(value);
  useEffect(() => {
    setInternalFile(value);
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      {/* Drop area */}
      <div
        role="button"
        onClick={() => document.getElementById("file-input")?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors"
      >
        <input
          id="file-input"
          type="file"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          aria-label="Upload file"
          onChange={handleChange}
          disabled={!!internalFile}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex h-11 w-11 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <UploadIcon className="h-4 w-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload file</p>
          <p className="text-muted-foreground text-xs">
            Drag & drop or click to browse (PDF, DOC, DOCX - max.{" "}
            {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {error && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="h-3 w-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File list */}
      {internalFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-xl border px-4 py-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon
                className="h-4 w-4 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium">
                  {internalFile.name}
                </p>
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground/80 hover:text-foreground -me-2 h-8 w-8 hover:bg-transparent"
              onClick={removeFile}
              aria-label="Remove file"
            >
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
