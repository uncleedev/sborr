import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CardInfoProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export default function CardInfo({
  icon: Icon,
  title,
  description,
  className,
}: CardInfoProps) {
  return (
    <Card
      className={`bg-white/95 backdrop-blur-md shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 ${className}`}
    >
      <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
        <div className="bg-primary/10 p-3 rounded-full">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h4 className="font-semibold text-gray-800 text-lg">{title}</h4>
        <p className="text-gray-600 font-medium">{description}</p>
      </CardContent>
    </Card>
  );
}
