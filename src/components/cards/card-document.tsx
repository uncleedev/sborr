import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Download, Scale, FileText } from "lucide-react";
import { Document } from "@/types/document-type";
import ViewDocument from "../home/view-document";

interface CardDocumentProps {
  data: Document;
}

export default function CardDocument({ data }: CardDocumentProps) {
  const typeLabel =
    {
      ordinance: "Ordinance",
      resolution: "Resolution",
      memorandum: "Memorandum",
    }[data.type] || "Document";

  const formattedDate = new Date(data.created_at).toLocaleDateString();

  const handleDownload = async (doc: Document) => {
    if (!doc.file_url) return;

    try {
      const response = await fetch(doc.file_url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      // Extract file extension from original URL or default to .pdf
      const extension = doc.file_url.split(".").pop() || "pdf";
      link.download = `${doc.title}.${extension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url); // clean up
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-5 md:p-6 rounded-2xl border border-primary/20 bg-primary/10 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type and Series */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
            {data.type === "ordinance" ? (
              <Scale className="size-4" />
            ) : (
              <FileText className="size-4" />
            )}
            <span>{typeLabel}</span>
          </span>
          <span className="text-base font-semibold text-primary whitespace-nowrap">
            {data.series} No. {data.number}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-start sm:justify-end gap-2">
          <ViewDocument document={data} />
          <Button onClick={() => handleDownload(data)}>
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1 text-left mt-4">
        <h4 className="text-lg font-semibold text-primary leading-snug break-words">
          {data.title}
        </h4>
        <p className="text-sm text-muted-foreground break-words">
          {data.description || "No description available."}
        </p>
      </div>

      {/* Date Section */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
        <Calendar className="size-4 shrink-0" />
        <span className="truncate">{formattedDate}</span>
      </div>
    </Card>
  );
}
