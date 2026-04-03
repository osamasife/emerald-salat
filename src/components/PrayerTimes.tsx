import { useEffect, useState, useCallback } from "react";
import { Clock, MapPin, Search, Timer, Navigation } from "lucide-react"; // أضفت أيقونة الملاحة
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
    () =>
      localStorage.getItem("lastCity") || (lang === "ar" ? "جدة" : "Jeddah"),
  );
  const [inputCity, setInputCity] = useState("");
  const [is24Hour, setIs24Hour] = useState(
    () => localStorage.getItem("timeFormat") === "24h",
  );
  const [nextPrayer, setNextPrayer] = useState("");
  const [loading, setLoading] = useState(false);
  const [timings, setTimings] = useState<Timings | null>(null);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "--:--";
    const [hours, minutes] = timeStr.split(" ")[0].split(":").map(Number);
    if (is24Hour)
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    const period = hours >= 12 ? "PM" : "AM";
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

  // دالة جلب المواقيت المحدثة (تدعم الإحداثيات أو اسم المدينة)
  const fetchTimings = useCallback(
    async (cityName?: string, coords?: { lat: number; lng: number }) => {
      setLoading(true);
      const today = new Date();
      const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

      // بناء الرابط بناءً على المتوفر (إحداثيات أو مدينة)
      let url = `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(cityName || city)}&country=Saudi Arabia&method=4`;

      if (coords) {
        url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${coords.lat}&longitude=${coords.lng}&method=4`;
      }

      try {
        const response = await fetch(url);
        const resData = await response.json();
        const tData = resData?.data?.timings;

        if (tData) {
          setTimings(tData);
          if (coords) {
            // إذا استخدمنا الموقع، نحاول معرفة اسم المدينة من الرد (اختياري)
            setCity(lang === "ar" ? "موقعي الحالي" : "My Location");
          } else if (cityName) {
            setCity(cityName);
            localStorage.setItem("lastCity", cityName);
          }
          findNextPrayer(tData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [city, lang, findNextPrayer],
  );

  // دالة طلب الموقع من المستخدم
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      fetchTimings(city); // العودة للمدينة الافتراضية
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchTimings(undefined, { lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Location access denied:", error);
        fetchTimings(city); // العودة للمدينة الافتراضية في حال الرفض
      },
    );
  }, [city, fetchTimings]);

  // تشغيل طلب الموقع عند أول دخول للتطبيق
  useEffect(() => {
    getUserLocation();

    const interval = setInterval(() => {
      if (timings) findNextPrayer(timings);
    }, 60000);
    return () => clearInterval(interval);
  }, []); // تعمل مرة واحدة عند الـ Mount

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-[#5a7d7d]">
          <MapPin size={18} className={loading ? "animate-pulse" : ""} />
          <span className="text-sm font-bold uppercase tracking-widest">
            {loading
              ? lang === "ar"
                ? "جاري التحديث..."
                : "Updating..."
              : city}
          </span>
          <button
            onClick={getUserLocation}
            className="p-1 hover:bg-black/5 rounded-full text-primary"
            title="Update Location"
          >
            <Navigation size={14} />
          </button>
        </div>
        <button
          onClick={() => {
            const newFormat = !is24Hour;
            setIs24Hour(newFormat);
            localStorage.setItem("timeFormat", newFormat ? "24h" : "12h");
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f1f1] text-[#b49b63] text-[10px] font-bold shadow-sm border border-black/5 active:scale-95 transition-transform"
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
        <div className="relative group">
          <Search
            size={16}
            className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors"
          />
          <input
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder={lang === "ar" ? "بحث عن مدينة..." : "Search city..."}
            className="h-11 w-full rounded-xl border border-black/10 bg-white/80 ps-11 text-sm outline-none shadow-sm focus:border-primary/30 transition-all"
          />
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 transition-all">
        {timings
          ? prayerNames.map((name) => (
              <div
                key={name}
                className={cn(
                  "flex items-center gap-4 rounded-[1.5rem] p-5 transition-all duration-300",
                  "bg-white border border-black/[0.03] shadow-[0_8px_20px_rgba(0,0,0,0.04)]",
                  nextPrayer === name &&
                    "ring-2 ring-[#e9c46a]/30 border-[#e9c46a]/50 scale-[1.02]",
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
            ))
          : // Skeleton loader بسيط أثناء التحميل
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-white rounded-[1.5rem] animate-pulse border border-black/[0.03]"
                />
              ))}
      </div>
    </div>
  );
};

export default PrayerTimes;
