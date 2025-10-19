import { useUser } from "@/hooks/useUser";
import { Card } from "../ui/card";
import { formatDateWithOrdinal } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CardActivityProps {
  log: {
    id: string;
    table_name: string;
    operation: string;
    record_id: string;
    changed_data?: Record<string, any>;
    performed_by?: string;
    performed_at: string;
  };
  isExpanded: boolean;
  toggleLog: (id: string) => void;
}

export default function CardActivity({
  log,
  isExpanded,
  toggleLog,
}: CardActivityProps) {
  const { getUserName } = useUser();

  const renderChangedData = () => {
    if (!log.changed_data) return null;
    return Object.entries(log.changed_data).map(([key, value]) => (
      <div
        key={key}
        className="flex justify-between items-start gap-3 py-2 border-t  first:border-t-0 first:pt-0"
      >
        <span className="">{key}</span>
        <span className="text-muted-foreground">{String(value)}</span>
      </div>
    ));
  };

  const getOperationColor = (operation: string) => {
    switch (operation.toLowerCase()) {
      case "insert":
        return "bg-info/5 text-info border-info/20";
      case "update":
        return "bg-warning/5 text-warning border-warning/20";
      case "delete":
        return "bg-danger/5 text-danger border-danger/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card className="transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold">
              {log.table_name.charAt(0).toUpperCase() + log.table_name.slice(1)}
            </h3>
          </div>
          <button
            onClick={() => toggleLog(log.id)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${getOperationColor(
                log.operation
              )}`}
            >
              {log.operation}
            </span>
          </div>

          <div className="space-y-1 text-sm">
            <p className="text-foreground">
              <span className="">Record ID:</span>{" "}
              <span className="text-muted-foreground">{log.record_id}</span>
            </p>
            <p className="text-foreground">
              <span>Performed by:</span>{" "}
              <span className="text-muted-foreground">
                {getUserName(log.performed_by)}
              </span>
            </p>
            <p className="text-foreground">
              <span>Date:</span>{" "}
              <span className="text-muted-foreground">
                {formatDateWithOrdinal(log.performed_at)}
              </span>
            </p>
          </div>
        </div>

        {isExpanded && log.changed_data && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Changes
            </p>
            <div className="space-y-0">{renderChangedData()}</div>
          </div>
        )}
      </div>
    </Card>
  );
}
