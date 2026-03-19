import { useState } from "react";
import { Languages } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import HomeView from "@/components/HomeView";
import PrayerTimes from "@/components/PrayerTimes";
import TasbihCounter from "@/components/TasbihCounter";
import IstikharaGuide from "@/components/IstikharaGuide";
import QuranView from "@/components/QuranView";
import DateHeader from "@/components/DateHeader";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { t, toggleLang, lang } = useLanguage();

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeView onNavigate={setActiveTab} />;
      case "prayer":
        return (
          <div className="space-y-6">
            <DateHeader />
            <PrayerTimes />
          </div>
        );
      case "tasbih":
        return (
          <div className="space-y-4">
            <h1 className="font-amiri text-2xl font-bold text-foreground">
              {t("smartTasbih")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("tasbihDesc")}
            </p>
            <TasbihCounter />
          </div>
        );
      case "quran":
        return <QuranView />;
      case "learn":
        return <IstikharaGuide />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <h1 className="font-amiri text-xl font-bold text-foreground">
            {t("appName")}<span className="text-accent">{t("appNameAccent")}</span>
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
            >
              <Languages size={14} />
              {lang === "en" ? "عربي" : "EN"}
            </button>
            <span className="text-lg">☪️</span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-4 pt-4">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
