import { useEffect, useState } from "react";
import { Clock, MapPin, Search } from "lucide-react";
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

const prayerNames: (keyof Timings)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const prayerIcons: Record<string, string> = {
  Fajr: "🌅", Sunrise: "☀️", Dhuhr: "🌤️", Asr: "⛅", Maghrib: "🌇", Isha: "🌙",
};

const prayerNamesAr: Record<string, string> = {
  Fajr: "الفجر", Sunrise: "الشروق", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء",
};

const PrayerTimes = () => {
  const { t, lang } = useLanguage();
  const [city, setCity] = useState("Mecca");
  const [inputCity, setInputCity] = useState("");
  const [timings, setTimings] = useState<Timings | null>(null);
  const [loading, setLoading] = useState(false);
  const [nextPrayer, setNextPrayer] = useState("");

  const fetchTimings = (c: string) => {
    setLoading(true);
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    fetch(
      `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(c)}&country=&method=2`
    )
      .then((r) => r.json())
      .then((data) => {
        const t = data?.data?.timings;
        if (t) {
          setTimings(t);
          setCity(c);
          findNextPrayer(t);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const findNextPrayer = (t: Timings) => {
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    for (const name of prayerNames) {
      if (name === "Sunrise") continue;
      const [h, m] = t[name].split(":").map(Number);
      if (h * 60 + m > nowMinutes) {
        setNextPrayer(name);
        return;
      }
    }
    setNextPrayer("Fajr");
  };

  useEffect(() => {
    fetchTimings(city);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) fetchTimings(inputCity.trim());
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin size={16} />
        <span className="text-sm font-medium">{city}</span>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder={t("enterCity")}
            className="h-10 w-full rounded-xl border border-input bg-card ps-9 pe-3 text-sm text-foreground outline-none transition-shadow focus:ring-2 focus:ring-accent/40"
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-emerald-medium"
        >
          {t("search")}
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center py-8">
          <Clock size={24} className="animate-spin text-accent" />
        </div>
      ) : timings ? (
        <div className="grid grid-cols-2 gap-3">
          {prayerNames.map((name) => (
            <div
              key={name}
              className={cn(
                "flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all",
                nextPrayer === name && "border-accent bg-accent/10 shadow-md"
              )}
            >
              <span className="text-xl">{prayerIcons[name]}</span>
              <div>
                <p className={cn("text-xs font-medium", nextPrayer === name ? "text-accent" : "text-muted-foreground")}>
                  {lang === "ar" ? prayerNamesAr[name] : name}
                </p>
                <p className="text-base font-bold text-foreground">
                  {timings[name]?.split(" ")[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PrayerTimes;
