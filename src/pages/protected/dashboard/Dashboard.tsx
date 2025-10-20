import CardCalendar from "@/components/cards/card-calendar";
import CardGraph from "@/components/cards/card-graph";
import CardReport from "@/components/cards/card-report";
import { useDashboardFeatures } from "@/hooks/features/useDashboard";

export default function DashboardPage() {
  const { reportData, chartData, chartStatistics } = useDashboardFeatures();

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportData.map((data, index) => (
          <CardReport key={index} {...data} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <CardGraph chartData={chartData} chartStatistics={chartStatistics} />
        <CardCalendar />
      </div>
    </section>
  );
}
