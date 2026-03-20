import { Clock, Hand, BookOpen, Home, BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", labelKey: "home" as const, icon: Home },
  { id: "prayer", labelKey: "prayer" as const, icon: Clock },
  { id: "tasbih", labelKey: "tasbih" as const, icon: Hand }, // سنبقي المفتاح كما هو ونغير العرض بالأسفل
  { id: "quran", labelKey: "quran" as const, icon: BookOpenText },
  { id: "learn", labelKey: "learn" as const, icon: BookOpen },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const { t, lang } = useLanguage(); // تأكدنا من استخراج lang هنا

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          // تحديد النص الذي سيظهر بناءً على اللغة وقيمة الـ Tab
          const label =
            tab.id === "tasbih"
              ? lang === "ar"
                ? "تسبيح وأذكار"
                : "Dhikr & Tasbih"
              : t(tab.labelKey);

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 transition-all duration-200",
                isActive ? "text-accent" : "text-muted-foreground",
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span
                className={cn(
                  "text-[9px] whitespace-nowrap text-center leading-tight",
                  isActive && "font-semibold",
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
