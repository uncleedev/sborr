import { useLogStore } from "@/stores/activity-store";
import { useEffect } from "react";

export const useLog = () => {
  const { logs, getAllLogs } = useLogStore();

  useEffect(() => {
    const fetchAllLogs = async () => {
      await getAllLogs();
    };

    fetchAllLogs();
  }, []);

  return {
    logs,
  };
};
