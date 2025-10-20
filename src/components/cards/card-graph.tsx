import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "../ui/card";

interface MonthlyChartData {
  name: string;
  resolution: number;
  memorandum: number;
  ordinance: number;
  total: number;
}

interface ChartStatistics {
  totalDocuments: number;
  totalResolutions: number;
  totalMemorandums: number;
  totalOrdinances: number;
  peakMonth: string;
  peakMonthCount: number;
  monthlyAverage: number;
}

interface CardGraphProps {
  chartData: MonthlyChartData[];
  chartStatistics: ChartStatistics;
}

export default function CardGraph({
  chartData,
  chartStatistics,
}: CardGraphProps) {
  return (
    <Card className="p-3 lg:col-span-3">
      <div className="flex flex-col gap-4">
        <header>
          <h2>Document Activity</h2>
          <p className="text-muted-foreground">
            Monthly document submission over time -{" "}
            {chartStatistics.totalDocuments} total documents this year
          </p>
        </header>
        {/* Fixed height container */}
        <div className="w-full h-[225px] lg:h-[350px]">
          <LinearChart chartData={chartData} />
        </div>
      </div>
    </Card>
  );
}

interface LinearChartProps {
  chartData: MonthlyChartData[];
}

function LinearChart({ chartData }: LinearChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce(
        (sum: number, entry: any) => sum + entry.value,
        0
      );

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-md">
          <p className="font-medium mb-2">{`${label} 2025`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
          <p className="text-sm font-medium mt-1 pt-1 border-t border-border">
            {`Total: ${total}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="ordinance"
          stroke="#326350"
          strokeWidth={2}
          dot={{ fill: "#326350", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#326350", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="resolution"
          stroke="#0D9112"
          strokeWidth={2}
          dot={{ fill: "#0D9112", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#0D9112", strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="memorandum"
          stroke="#D3B574"
          strokeWidth={2}
          dot={{ fill: "#D3B574", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#D3B574", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
