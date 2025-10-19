import { supabase } from "@/lib/supabase";

export const BackupService = {
  async createBackup() {
    try {
      const { data, error } = await supabase.functions.invoke(
        "backup-database",
        {
          method: "GET",
        }
      );

      if (error) throw error;
      if (!data?.url || !data?.fileName)
        throw new Error("No backup URL returned");

      // Fetch the file as a blob
      const response = await fetch(data.url);
      const blob = await response.blob();

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = data.fileName;
      document.body.appendChild(link); // required for Firefox
      link.click();
      link.remove(); // clean up
      URL.revokeObjectURL(link.href);

      return { success: true, message: "Backup downloaded successfully!" };
    } catch (error: any) {
      console.error("BackupService Error:", error);
      return { success: false, message: error.message || "Backup failed" };
    }
  },

  async listBackups() {
    const { data, error } = await supabase.storage
      .from("db-backups")
      .list("", { sortBy: { column: "name", order: "desc" } });

    if (error) throw error;
    return data || [];
  },

  async getSignedUrl(fileName: string) {
    const { data, error } = await supabase.storage
      .from("db-backups")
      .createSignedUrl(fileName, 60 * 60 * 24); // 24 hours
    if (error) throw error;
    return data?.signedUrl || "";
  },

  async deleteBackup(fileName: string) {
    const { error } = await supabase.storage
      .from("db-backups")
      .remove([fileName]);
    if (error) throw error;
  },

  async restoreBackup(file: File) {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      const deleteOrder = [
        "activity_logs",
        "notifications_queue",
        "session_documents",
        "documents",
        "sessions",
        "users",
      ];

      for (const table of deleteOrder) {
        if (!backupData[table]) continue;

        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .not("id", "is", null);
        if (deleteError) {
          console.error(`Error deleting ${table}:`, deleteError);
          return {
            success: false,
            message: `Error clearing ${table}: ${deleteError.message}`,
          };
        }
      }

      const insertOrder = [
        "users",
        "sessions",
        "documents",
        "session_documents",
        "notifications_queue",
        "activity_logs",
      ];

      for (const table of insertOrder) {
        if (!backupData[table] || !Array.isArray(backupData[table])) continue;

        const { error } = await supabase.from(table).insert(backupData[table]);
        if (error) {
          console.error(`Error restoring ${table}:`, error);

          if (error.message.includes("duplicate key value")) {
            const { error: upsertError } = await supabase
              .from(table)
              .upsert(backupData[table], { onConflict: "id" });
            if (upsertError) {
              return {
                success: false,
                message: `Error upserting ${table}: ${upsertError.message}`,
              };
            }
          } else {
            return {
              success: false,
              message: `Error restoring ${table}: ${error.message}`,
            };
          }
        }
      }

      return { success: true, message: "Backup restored successfully!" };
    } catch (error: any) {
      console.error("Restore error:", error);
      return { success: false, message: error.message || "Restore failed" };
    }
  },
};
