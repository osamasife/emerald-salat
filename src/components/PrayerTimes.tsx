import { useEffect, useState, useCallback } from "react";
import { Clock, MapPin, Search, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface Timings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const prayerNames: (keyof Timings)[] = [
  "Fajr",
  "Sunrise",
  "Dhuhr",
  "Asr",
  "Maghrib",
  "Isha",
];
const prayerIcons: Record<string, string> = {
  Fajr: "🌅",
  Sunrise: "☀️",
  Dhuhr: "🌤️",
  Asr: "⛅",
  Maghrib: "🌇",
  Isha: "🌙",
};
const prayerNamesAr: Record<string, string> = {
  Fajr: "الفجر",
  Sunrise: "الشروق",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const PrayerTimes = () => {
  const { lang } = useLanguage();
  const [city, setCity] = useState(
    () => localStorage.getItem("lastCity") || "Jeddah",
  );
  const [inputCity, setInputCity] = useState("");
  const [is24Hour, setIs24Hour] = useState(
    () => localStorage.getItem("timeFormat") === "24h",
  );
  const [nextPrayer, setNextPrayer] = useState("");
  const [loading, setLoading] = useState(false);

  const [timings, setTimings] = useState<Timings | null>(() => {
    const saved = localStorage.getItem(
      `timings_${localStorage.getItem("lastCity") || "Jeddah"}`,
    );
    return saved ? JSON.parse(saved) : null;
  });

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "--:--";
    const [hours, minutes] = timeStr.split(" ")[0].split(":").map(Number);
    if (is24Hour)
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    const period =
      hours >= 12 ? (lang === "ar" ? "PM" : "PM") : lang === "ar" ? "AM" : "AM";
    const h12 = hours % 12 || 12;
    return `${h12}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const findNextPrayer = useCallback((t: Timings) => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    for (const name of prayerNames) {
      if (name === "Sunrise") continue;
      const [h, m] = t[name].split(" ")[0].split(":").map(Number);
      if (h * 60 + m > nowMinutes) {
        setNextPrayer(name);
        return;
      }
    }
    setNextPrayer("Fajr");
  }, []);

  const fetchTimings = useCallback(
    async (cityName: string) => {
      setLoading(true);
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(cityName)}&country=Saudi Arabia&method=4`,
        );
        const resData = await response.json();
        const tData = resData?.data?.timings;
        if (tData) {
          setTimings(tData);
          setCity(cityName);
          localStorage.setItem("lastCity", cityName);
          localStorage.setItem(`timings_${cityName}`, JSON.stringify(tData));
          findNextPrayer(tData);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [findNextPrayer],
  );

  useEffect(() => {
    fetchTimings(city);
    if (timings) findNextPrayer(timings);
    const interval = setInterval(() => {
      if (timings) findNextPrayer(timings);
    }, 60000);
    return () => clearInterval(interval);
  }, [city, timings, findNextPrayer]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-[#5a7d7d]">
          <MapPin size={18} />
          <span className="text-sm font-bold uppercase tracking-widest">
            {city}
          </span>
        </div>
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f1f1] text-[#b49b63] text-[10px] font-bold shadow-sm border border-black/5"
        >
          <Timer size={12} /> {is24Hour ? "24H" : "12H"}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputCity.trim()) fetchTimings(inputCity.trim());
        }}
        className="px-1"
      >
        <div className="relative">
          <Search
            size={16}
            className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
          />
          <input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Search city..."
            className="h-11 w-full rounded-xl border border-black/10 bg-white/80 ps-11 text-sm outline-none shadow-sm"
          />
        </div>
      </form>

      {/* هنا التعديل الجوهري: جعل الكروت مطابقة تماماً للأذكار */}
      <div className="grid grid-cols-2 gap-4 transition-all">
        {timings &&
          prayerNames.map((name) => (
            <div
              key={name}
              className={cn(
                "flex items-center gap-4 rounded-[1.5rem] p-5 transition-all duration-300",
                // خلفية بيضاء صلبة (ليست شفافة) مع ظل سفلي ناعم مثل كروت الأذكار
                "bg-white border border-black/[0.03] shadow-[0_8px_20px_rgba(0,0,0,0.04)]",
                nextPrayer === name &&
                  "ring-2 ring-[#e9c46a]/30 border-[#e9c46a]/50",
              )}
            >
              <span className="text-2xl filter saturate-[0.8]">
                {prayerIcons[name]}
              </span>
              <div className="flex flex-col">
                <p
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-widest mb-0.5",
                    nextPrayer === name
                      ? "text-[#e9c46a]"
                      : "text-muted-foreground/60",
                  )}
                >
                  {lang === "ar" ? prayerNamesAr[name] : name}
                </p>
                <p className="text-xl font-bold text-[#5a5a5a] tabular-nums leading-none">
                  {formatTime(timings[name])}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
