import { useMemo } from "react";
import { FileText, CalendarDays, Users, Clock } from "lucide-react";
import { CardReportProps } from "@/components/cards/card-report";
import { useUser } from "../useUser";
import { useSession } from "../useSession";
import { useDocument } from "../useDocument";

export interface MonthlyChartData {
  name: string;
  resolution: number;
  memorandum: number;
  ordinance: number;
  total: number;
}

export interface ChartStatistics {
  totalDocuments: number;
  totalResolutions: number;
  totalMemorandums: number;
  totalOrdinances: number;
  peakMonth: string;
  peakMonthCount: number;
  monthlyAverage: number;
}

export const useDashboardFeatures = () => {
  const { documents } = useDocument();
  const { users } = useUser();
  const { sessions } = useSession();

  // ====== REPORT CARDS ======
  const reportData: CardReportProps[] = useMemo(() => {
    const totalDocuments = documents.length;
    const pendingApprovals = documents.filter(
      (doc) => doc.status === "for_review"
    ).length;

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthCount = documents.filter((doc) => {
      const created = new Date(doc.created_at);
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length;

    const lastMonthCount = documents.filter((doc) => {
      const created = new Date(doc.created_at);
      return (
        created.getMonth() === lastMonth.getMonth() &&
        created.getFullYear() === lastMonth.getFullYear()
      );
    }).length;

    const monthlyChange = thisMonthCount - lastMonthCount;

    const sessionsThisMonth = sessions.filter((s) => {
      const date = new Date(s.scheduled_at);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    const scheduledAhead = sessions.filter(
      (s) => new Date(s.scheduled_at) > now
    ).length;

    const activeUsers = users.length;
    const usersThisWeek = users.filter((u) => {
      const created = new Date(u.created_at);
      const diffDays =
        (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }).length;

    return [
      {
        label: "Total Documents",
        value: totalDocuments.toLocaleString(),
        icon: FileText,
        labelDescription:
          monthlyChange > 0
            ? `+${monthlyChange} from last month`
            : monthlyChange < 0
            ? `${monthlyChange} from last month`
            : "No change from last month",
      },
      {
        label: "Session This Month",
        value: sessionsThisMonth,
        icon: CalendarDays,
        labelDescription:
          scheduledAhead > 0
            ? `${scheduledAhead} scheduled ahead`
            : "No upcoming sessions",
      },
      {
        label: "Active Users",
        value: activeUsers,
        icon: Users,
        labelDescription:
          usersThisWeek > 0 ? `+${usersThisWeek} this week` : "No new users",
      },
      {
        label: "Pending Approvals",
        value: pendingApprovals,
        icon: Clock,
        labelDescription:
          pendingApprovals > 5
            ? `${pendingApprovals - 5} urgent`
            : pendingApprovals > 0
            ? "Review pending items"
            : "All caught up!",
      },
    ];
  }, [documents, users, sessions]);

  // ====== CHART DATA (only last 5 months) ======
  const chartData: MonthlyChartData[] = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize
    const monthlyData: MonthlyChartData[] = months.map((m) => ({
      name: m,
      resolution: 0,
      memorandum: 0,
      ordinance: 0,
      total: 0,
    }));

    // Count documents per month/category
    documents.forEach((doc) => {
      const d = new Date(doc.created_at);
      if (d.getFullYear() !== currentYear) return;

      const i = d.getMonth();
      const c = doc.type?.toLowerCase();
      if (c === "resolution") monthlyData[i].resolution++;
      if (c === "memorandum") monthlyData[i].memorandum++;
      if (c === "ordinance") monthlyData[i].ordinance++;
      monthlyData[i].total++;
    });

    // 🔥 Keep only the last 5 months
    const now = new Date();
    const last5 = now.getMonth() + 1; // month is 0-indexed
    const start = Math.max(last5 - 5, 0);
    return monthlyData.slice(start, last5);
  }, [documents]);

  // ====== CHART STATS ======
  const chartStatistics: ChartStatistics = useMemo(() => {
    const totalDocuments = chartData.reduce((sum, m) => sum + m.total, 0);
    const totalResolutions = chartData.reduce(
      (sum, m) => sum + m.resolution,
      0
    );
    const totalMemorandums = chartData.reduce(
      (sum, m) => sum + m.memorandum,
      0
    );
    const totalOrdinances = chartData.reduce((sum, m) => sum + m.ordinance, 0);

    const peak = chartData.reduce(
      (p, c) => (c.total > p.total ? c : p),
      chartData[0] || { name: "-", total: 0 }
    );

    return {
      totalDocuments,
      totalResolutions,
      totalMemorandums,
      totalOrdinances,
      peakMonth: peak.name,
      peakMonthCount: peak.total,
      monthlyAverage: Math.round(totalDocuments / (chartData.length || 1)),
    };
  }, [chartData]);

  return {
    reportData,
    chartData,
    chartStatistics,
  };
};
