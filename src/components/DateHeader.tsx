import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Calendar,
  Sun,
  Moon,
  CloudSun,
  Sunrise,
  Cloud,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DateHeader = () => {
  const { lang } = useLanguage();
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const gregorian = today.toLocaleDateString(
    lang === "ar" ? "ar-SA" : "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  let finalHijri = "";
  try {
    const hijriDate = new Intl.DateTimeFormat(
      lang === "ar"
        ? "ar-SA-u-ca-islamic-umalqura"
        : "en-US-u-ca-islamic-umalqura",
      { day: "numeric", month: "long", year: "numeric" },
    ).format(today);
    finalHijri =
      hijriDate.includes("هـ") || hijriDate.includes("AH")
        ? hijriDate
        : `${hijriDate} ${lang === "ar" ? "هـ" : "AH"}`;
  } catch (e) {
    finalHijri = gregorian;
  }

  const currentHour = today.getHours();

  // تحديد نوع الأيقونة بناءً على الوقت
  const theme = useMemo(() => {
    if (currentHour >= 5 && currentHour < 11) return "morning"; // صباح: سحب
    if (currentHour >= 11 && currentHour < 16) return "noon"; // ظهر: شمس
    if (currentHour >= 16 && currentHour < 19) return "evening"; // مغرب: سحب وشمس
    return "night"; // ليل: عشوائي نجوم/أهلة
  }, [currentHour]);

  const getDynamicContent = () => {
    const isAr = lang === "ar";

    // إعدادات الثيم البصري
    const config = {
      morning: {
        text: isAr
          ? "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ"
          : "THE KINGDOM BELONGS TO ALLAH",
        mainIcon: <Sunrise size={24} className="text-amber-300" />,
        patternIcon: <Cloud size={14} />,
        bigIcon: <Cloud size={220} />,
        bg: "from-sky-500 to-blue-600",
      },
      noon: {
        text: isAr ? "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ" : "GLORY BE TO ALLAH",
        mainIcon: <Sun size={24} className="text-yellow-300" />,
        patternIcon: <Sun size={14} />,
        bigIcon: <Sun size={220} />,
        bg: "from-blue-500 to-cyan-500",
      },
      evening: {
        text: isAr
          ? "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ"
          : "EVENING HAS COME FOR ALLAH",
        mainIcon: <CloudSun size={24} className="text-orange-300" />,
        patternIcon: <Cloud size={14} />,
        bigIcon: <CloudSun size={220} />,
        bg: "from-orange-600 to-slate-800",
      },
      night: {
        text: isAr
          ? "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي"
          : "IN YOUR NAME MY LORD I LAY DOWN",
        mainIcon: <Moon size={24} className="text-blue-200" />,
        patternIcon:
          Math.random() > 0.5 ? <Star size={14} /> : <Moon size={14} />,
        bigIcon:
          Math.random() > 0.5 ? <Star size={220} /> : <Moon size={220} />,
        bg: "from-slate-900 to-indigo-950",
      },
    };

    return config[theme];
  };

  const content = getDynamicContent();

  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${content.bg} p-8 text-primary-foreground shadow-2xl transition-all duration-1000 min-h-[230px] flex flex-col justify-between`}
    >
      {/* 1. الزخرفة الخلفية (النمط المتغير) */}
      <div className="absolute inset-0 opacity-[0.12] grid grid-cols-10 gap-2 p-2 pointer-events-none rotate-[15deg]">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="flex justify-center items-center text-white">
            {content.patternIcon}
          </div>
        ))}
      </div>

      {/* 2. الأيقونة الكبيرة المتغيرة */}
      <div className="absolute -right-12 -top-16 opacity-20 rotate-[20deg] scale-125 text-white pointer-events-none">
        {content.bigIcon}
      </div>

      {/* 3. المحتوى العلوي */}
      <div className="relative z-10 space-y-1">
        <p className="text-[10px] font-sans font-light uppercase tracking-[0.4em] text-white/60">
          {gregorian}
        </p>
        <div className="flex items-center gap-3">
          <Calendar size={16} className="text-accent/80" />
          <p className="font-sans text-lg font-medium text-white tracking-tight">
            {finalHijri}
          </p>
        </div>
      </div>

      {/* 4. قسم الذكر مع الأيقونة المرتفعة والموحدة */}
      <div className="mt-8 flex flex-col items-center border-t border-white/10 pt-8 relative z-10">
        <div className="absolute -top-4 bg-white/5 backdrop-blur-md p-2 rounded-full border border-white/10 transform transition-transform hover:scale-110 duration-500">
          {content.mainIcon}
        </div>

        <p
          className={`
          text-center leading-none uppercase mt-2
          ${
            lang === "ar"
              ? "font-amiri text-[1.3rem] font-bold text-accent px-2"
              : "font-sans text-[12px] font-medium tracking-[0.3em] text-accent/90 whitespace-nowrap"
          } 
          drop-shadow-lg transition-all duration-500
        `}
        >
          {content.text}
        </p>
      </div>
    </div>
  );
};

export default DateHeader;
