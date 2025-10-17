import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchbarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function Searchbar({ value, onChange }: SearchbarProps) {
  return (
    <div className="w-full ">
      <div className="relative">
        <Input
          className="peer ps-9"
          placeholder="Search ..."
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <Search size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
