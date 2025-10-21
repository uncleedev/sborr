import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Download, Eye, Scale, FileText } from "lucide-react";
import { Document } from "@/types/document-type";

interface CardDocumentProps {
  document: Document;
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
}

export default function CardDocument({
  document,
  onView,
  onDownload,
}: CardDocumentProps) {
  const typeLabel =
    {
      ordinance: "Ordinance",
      resolution: "Resolution",
      memorandum: "Memorandum",
    }[document.type] || "Document";

  const formattedDate = new Date(document.created_at).toLocaleDateString();

  return (
    <Card className="w-full max-w-4xl mx-auto p-5 md:p-6 rounded-2xl border border-primary/20 bg-primary/10 shadow-sm hover:shadow-md transition-shadow ">
      {/* Top Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type and Series */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium">
            {document.type === "ordinance" ? (
              <Scale className="size-4" />
            ) : (
              <FileText className="size-4" />
            )}
            <span>{typeLabel}</span>
          </span>
          <span className="text-base font-semibold text-primary whitespace-nowrap">
            No. {document.series}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-start sm:justify-end gap-2">
          <Button
            size="sm"
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center w-full sm:w-auto"
            onClick={() => onView?.(document)}
          >
            <Eye className="size-4 mr-2" />
            View
          </Button>
          <Button
            size="sm"
            variant="default"
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center w-full sm:w-auto"
            onClick={() => onDownload?.(document)}
          >
            <Download className="size-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1 text-left">
        <h4 className="text-lg font-semibold text-primary leading-snug break-words">
          {document.title}
        </h4>
        <p className="text-sm text-muted-foreground break-words">
          {document.description || "No description available."}
        </p>
      </div>

      {/* Date Section */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Calendar className="size-4 shrink-0" />
        <span className="truncate">{formattedDate}</span>
      </div>
    </Card>
  );
}
