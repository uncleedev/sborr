import { activityService } from "@/services/activity-service";
import { ActivityLog } from "@/types/activity";
import { toast } from "sonner";
import { create } from "zustand";

interface ActivityState {
  logs: ActivityLog[];
  error: string | null;
  loading: boolean;

  getAllLogs: () => Promise<void>;
}

export const useLogStore = create<ActivityState>((set) => ({
  logs: [],
  error: null,
  loading: false,

  getAllLogs: async () => {
    set({ loading: true, error: null });

    try {
      const data = await activityService.getAllActivity();
      set({ logs: data });
    } catch (error: any) {
      set({ error: error.message });
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
