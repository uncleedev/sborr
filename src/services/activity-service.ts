import { supabase } from "@/lib/supabase";
import { ActivityLog } from "@/types/activity";

export const activityService = {
  async getAllActivity(): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("performed_at", { ascending: false });

    if (error)
      throw new Error(error.message || "Failed to get all activity logs");

    return data as ActivityLog[];
  },
};
