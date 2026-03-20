import { useState, useCallback } from "react";
import { RotateCcw, Trophy, Minus, Plus, Hand, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import HisnAlMuslim from "./HisnAlMuslim"; // تأكد أن الملف موجود في نفس المجلد

const presets = [33, 99, 100];

const TasbihCounter = () => {
  const { t, lang } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState("counter"); // "counter" or "adhkar"
  const [target, setTarget] = useState(33);
  const [count, setCount] = useState(33);
  const [victory, setVictory] = useState(false);

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
      {/* أزرار التبديل العلوية المستقلة */}
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

      {/* المحتوى المتغير بناءً على التبويب */}
      {activeSubTab === "counter" ? (
        <div className="flex flex-col items-center gap-6 animate-in fade-in duration-300">
          {victory ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="animate-victory">
                <Trophy size={72} className="text-accent" />
              </div>
              <h2 className="font-amiri text-3xl font-bold text-foreground">
                سبحان الله
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
                  className="rounded-full bg-secondary p-2"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm text-muted-foreground">
                  {t("target")}: {target}
                </span>
                <button
                  onClick={() => adjustTarget(1)}
                  className="rounded-full bg-secondary p-2"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleTap}
                className="relative flex h-48 w-48 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform active:scale-95"
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
                    stroke="hsl(var(--border))"
                    strokeWidth="6"
                    opacity="0.3"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="92"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 92}
                    strokeDashoffset={2 * Math.PI * 92 * (1 - progress / 100)}
                    className="transition-all duration-300 text-accent"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold">{count}</span>
                  <span className="mt-1 text-xs uppercase tracking-wider opacity-70">
                    {t("tap")}
                  </span>
                </div>
              </button>

              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
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
