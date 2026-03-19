import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import HomeView from "@/components/HomeView";
import PrayerTimes from "@/components/PrayerTimes";
import TasbihCounter from "@/components/TasbihCounter";
import IstikharaGuide from "@/components/IstikharaGuide";
import DateHeader from "@/components/DateHeader";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

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
              Smart Tasbih
            </h1>
            <p className="text-sm text-muted-foreground">
              Set your target, tap to count, feel the vibration.
            </p>
            <TasbihCounter />
          </div>
        );
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
            Muslim<span className="text-accent"> Pro</span>
          </h1>
          <span className="text-lg">☪️</span>
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
