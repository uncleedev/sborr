import { BackupService } from "@/services/backup-service";
import { create } from "zustand";

interface BackupState {
  isBackingUp: boolean;
  message: string | null;
  createBackup: () => Promise<void>;
}

export const useBackupStore = create<BackupState>((set) => ({
  isBackingUp: false,
  message: null,

  createBackup: async () => {
    set({ isBackingUp: true, message: null });

    const result = await BackupService.createBackup();

    set({
      isBackingUp: false,
      message: result.message,
    });
  },
}));
