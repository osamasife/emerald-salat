import { useState, useCallback } from "react";
import { RotateCcw, Trophy, Minus, Plus, Hand, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import HisnAlMuslim from "./HisnAlMuslim";

const presets = [33, 99, 100];

// الأذكار المقترحة للتسبيح
const quickDhkr = [
  { ar: "سبحان الله", en: "Subhan Allah" },
  { ar: "الحمد لله", en: "Alhamdulillah" },
  { ar: "الله أكبر", en: "Allahu Akbar" },
  { ar: "أستغفر الله", en: "Astaghfirullah" },
];

const TasbihCounter = () => {
  const { t, lang } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState("counter");
  const [target, setTarget] = useState(33);
  const [count, setCount] = useState(33);
  const [victory, setVictory] = useState(false);
  const [currentDhkrIndex, setCurrentDhkrIndex] = useState(0);

  const triggerHaptic = useCallback(() => {
    if ("vibrate" in navigator) navigator.vibrate(30);
  }, []);

  const handleTap = () => {
    if (count <= 0 || victory) return;
    triggerHaptic();
    const next = count - 1;
    setCount(next);
    if (next === 0) setVictory(true);
  };

  const reset = () => {
    setCount(target);
    setVictory(false);
  };

  const selectPreset = (p: number) => {
    setTarget(p);
    setCount(p);
    setVictory(false);
  };

  const adjustTarget = (delta: number) => {
    const next = Math.max(1, target + delta);
    setTarget(next);
    setCount(next);
    setVictory(false);
  };

  const progress = ((target - count) / target) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex p-1 bg-secondary/50 rounded-2xl w-full max-w-xs mx-auto">
        <button
          onClick={() => setActiveSubTab("counter")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
            activeSubTab === "counter"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Hand size={16} />
          {lang === "ar" ? "المسبحة" : "Tasbih"}
        </button>
        <button
          onClick={() => setActiveSubTab("adhkar")}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2",
            activeSubTab === "adhkar"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Heart size={16} />
          {lang === "ar" ? "الأذكار" : "Adhkar"}
        </button>
      </div>

      {activeSubTab === "counter" ? (
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-300">
          {victory ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="animate-victory">
                <Trophy size={72} className="text-accent" />
              </div>
              <h2 className="font-amiri text-4xl font-bold text-foreground">
                تقبل الله طاعتك
              </h2>
              <p className="text-lg font-semibold text-accent">
                {t("challengeComplete")}
              </p>
              <button
                onClick={reset}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors"
              >
                <RotateCcw size={18} />
                {t("newChallenge")}
              </button>
            </div>
          ) : (
            <>
              {/* قسم الأذكار المقترحة - الجديد */}
              <div className="w-full max-w-sm overflow-x-auto no-scrollbar py-2">
                <div className="flex gap-3 justify-center">
                  {quickDhkr.map((dhkr, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentDhkrIndex(idx)}
                      className={cn(
                        "whitespace-nowrap px-4 py-2 rounded-2xl border transition-all text-sm font-medium",
                        currentDhkrIndex === idx
                          ? "bg-primary/5 border-primary text-primary shadow-sm"
                          : "bg-white border-black/[0.03] text-muted-foreground hover:border-black/10",
                      )}
                    >
                      {lang === "ar" ? dhkr.ar : dhkr.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* الذكر النشط حالياً */}
              <div className="h-12 flex items-center justify-center">
                <h2
                  className={cn(
                    "text-3xl font-bold text-foreground transition-all duration-500 font-amiri",
                    "animate-in fade-in zoom-in-95",
                  )}
                >
                  {lang === "ar"
                    ? quickDhkr[currentDhkrIndex].ar
                    : quickDhkr[currentDhkrIndex].en}
                </h2>
              </div>

              <div className="flex gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => selectPreset(p)}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                      target === p
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => adjustTarget(-1)}
                  className="rounded-full bg-secondary p-2 active:scale-90 transition-transform"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-bold text-muted-foreground">
                  {t("target")}: {target}
                </span>
                <button
                  onClick={() => adjustTarget(1)}
                  className="rounded-full bg-secondary p-2 active:scale-90 transition-transform"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleTap}
                className="relative flex h-52 w-52 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_20px_50px_rgba(var(--primary-rgb),0.2)] transition-transform active:scale-95"
              >
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 200 200"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    opacity="0.1"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 92}
                    strokeDashoffset={2 * Math.PI * 92 * (1 - progress / 100)}
                    className="transition-all duration-300 text-accent"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-6xl font-bold tracking-tighter">
                    {count}
                  </span>
                  <span className="mt-2 text-[10px] uppercase tracking-[0.2em] font-black opacity-60">
                    {lang === "ar" ? "اضغط" : "TAP"}
                  </span>
                </div>
              </button>

              <button
                onClick={reset}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw size={14} />
                {t("reset")}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="animate-in slide-in-from-right-4 duration-300">
          <HisnAlMuslim />
        </div>
      )}
    </div>
  );
};

export default TasbihCounter;
