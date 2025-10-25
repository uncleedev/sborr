import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  DatabaseBackup,
  UploadCloud,
  Trash2,
  Download,
} from "lucide-react";
import { BackupService } from "@/services/backup-service";
import { useLog } from "@/hooks/useLog";
import { toast } from "sonner";
import CardActivity from "@/components/cards/card-activity";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingPage() {
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState<{ name: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { logs } = useLog();
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Fetch backup files
  const fetchBackups = async () => {
    setRefreshing(true);
    try {
      const files = await BackupService.listBackups();
      setBackups(files);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch backups");
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // Generate list of unique dates from logs
  const logDates = Array.from(
    new Set(
      logs.map((log) =>
        new Date(log.performed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      )
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Automatically set current date (or latest date if available)
  useEffect(() => {
    if (logDates.length > 0 && !selectedDate) {
      setSelectedDate(logDates[0]); // ✅ defaults to the latest (usually today)
    }
  }, [logDates, selectedDate]);

  // Filter logs by selected date
  const filteredLogs = logs.filter(
    (log) =>
      new Date(log.performed_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) === selectedDate
  );

  // Log expand toggle
  const toggleLog = (id: string) => {
    setExpandedLogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Backup handling
  const handleBackup = async () => {
    setLoading(true);
    const result = await BackupService.createBackup();
    setLoading(false);
    result.success
      ? toast.success(result.message)
      : toast.error(result.message);
    fetchBackups();
  };

  const handleRestoreFile = async (fileName: string) => {
    setLoading(true);
    try {
      const url = await BackupService.getSignedUrl(fileName);
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: "application/json" });

      const result = await BackupService.restoreBackup(file);
      result.success
        ? toast.success(result.message)
        : toast.error(result.message);
    } catch (error: any) {
      toast.error(error.message || "Restore failed");
    }
    setLoading(false);
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      await BackupService.deleteBackup(fileName);
      toast.success("Backup deleted");
      fetchBackups();
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    }
  };

  const handleDownloadFile = async (fileName: string) => {
    try {
      const url = await BackupService.getSignedUrl(fileName);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
    } catch (error: any) {
      toast.error(error.message || "Download failed");
    }
  };

  return (
    <div className="grid grid-cols-5 gap-4 h-full">
      {/* Activity Logs */}
      <Card className="col-span-3 p-4">
        <header className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold">Activity Log</h3>
            <p className="text-sm text-muted-foreground">Logs by date</p>
          </div>

          {/* Date Filter */}
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {logDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <div className="flex flex-col gap-4">
          {filteredLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No logs found for this day.
            </p>
          ) : (
            filteredLogs.map((log) => (
              <CardActivity
                key={log.id}
                log={log}
                isExpanded={expandedLogs.has(log.id)}
                toggleLog={toggleLog}
              />
            ))
          )}
        </div>
      </Card>

      {/* Backup Section */}
      <div className="col-span-2 space-y-4">
        {/* Create Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseBackup size={20} /> Database Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleBackup}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} /> Creating
                  Backup...
                </>
              ) : (
                <>
                  <DatabaseBackup className="mr-2" size={16} /> Create Backup
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Manage Backups */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud size={20} /> Restore / Manage Backups
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 max-h-80 overflow-y-auto">
            {refreshing ? (
              <p className="text-sm text-muted-foreground">
                Loading backups...
              </p>
            ) : backups.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No backups available.
              </p>
            ) : (
              backups.map((backup) => (
                <div
                  key={backup.name}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span className="truncate">{backup.name}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRestoreFile(backup.name)}
                      disabled={loading}
                    >
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadFile(backup.name)}
                      disabled={loading}
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteFile(backup.name)}
                      disabled={loading}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
