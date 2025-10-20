import { LucideIcon } from "lucide-react";
import { Card } from "../ui/card";

export interface CardReportProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  labelDescription?: string;
}

export default function CardReport(props: CardReportProps) {
  const { label, value, icon: Icon, labelDescription } = props;

  return (
    <Card className="group flex-row items-start justify-between p-5">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground mb-1">
          {label}
        </p>
        <h2 className="text-2xl font-bold text-foreground mb-2">{value}</h2>
        {labelDescription && (
          <p className="text-xs text-muted-foreground font-medium">
            {labelDescription}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors duration-200">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
