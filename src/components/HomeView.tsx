import DateHeader from "./DateHeader";
import PrayerTimes from "./PrayerTimes";
import { BookOpen, Hand } from "lucide-react";

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

const HomeView = ({ onNavigate }: HomeViewProps) => {
  return (
    <div className="space-y-6">
      <DateHeader />
      <PrayerTimes />

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("tasbih")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-md"
        >
          <Hand size={28} className="text-accent" />
          <span className="text-sm font-semibold text-foreground">Tasbih</span>
          <span className="text-xs text-muted-foreground">Challenge</span>
        </button>
        <button
          onClick={() => onNavigate("learn")}
          className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent hover:shadow-md"
        >
          <BookOpen size={28} className="text-accent" />
          <span className="text-sm font-semibold text-foreground">Istikhara</span>
          <span className="text-xs text-muted-foreground">Learn</span>
        </button>
      </div>
    </div>
  );
};

export default HomeView;
