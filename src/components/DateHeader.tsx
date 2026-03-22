import { useState, useEffect } from "react";
import { Star, Calendar, Sun, Moon, CloudSun, Sunrise } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DateHeader = () => {
  const { lang } = useLanguage();
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 1. التاريخ الميلادي
  const gregorian = today.toLocaleDateString(
    lang === "ar" ? "ar-SA" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  // 2. التاريخ الهجري مع الحماية من الأخطاء (Safe Parsing)
  let finalHijri = "";
  try {
    const hijriDate = new Intl.DateTimeFormat(
      lang === "ar"
        ? "ar-SA-u-ca-islamic-umalqura"
        : "en-US-u-ca-islamic-umalqura",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ).format(today);

    const hasSuffix = hijriDate.includes("هـ") || hijriDate.includes("AH");
    finalHijri = hasSuffix
      ? hijriDate
      : `${hijriDate} ${lang === "ar" ? "هـ" : "AH"}`;
  } catch (error) {
    console.warn(
      "Umalqura calendar not supported, falling back to standard hijri",
    );
    try {
      // حل بديل في حال فشل أم القرى: استخدام التقويم الهجري العادي
      const fallbackHijri = new Intl.DateTimeFormat(
        lang === "ar" ? "ar-SA-u-ca-islamic" : "en-US-u-ca-islamic",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      ).format(today);
      finalHijri = fallbackHijri;
    } catch (e) {
      // حل أخير إذا تعطلت كل التقاويم الهجرية في المتصفح، يظهر التاريخ الميلادي فقط لمنع الـ Crash
      finalHijri = gregorian;
    }
  }

  const currentHour = today.getHours();

  const getDynamicContent = () => {
    if (currentHour >= 4 && currentHour < 12) {
      return {
        text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        icon: <Sunrise size={24} className="text-amber-300" />,
        bgGradient: "from-sky-500 to-amber-500",
      };
    }
    if (currentHour >= 16 && currentHour < 20) {
      return {
        text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
        icon: <CloudSun size={24} className="text-orange-300" />,
        bgGradient: "from-orange-600 to-slate-800",
      };
    }
    if (currentHour >= 20 || currentHour < 4) {
      return {
        text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي",
        icon: <Moon size={24} className="text-blue-200" />,
        bgGradient: "from-slate-800 to-indigo-950",
      };
    }
    const daytimeAthkar = [
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    ];
    const randomIndex = today.getMinutes() % daytimeAthkar.length;

    return {
      text: daytimeAthkar[randomIndex],
      icon: <Sun size={24} className="text-yellow-300" />,
      bgGradient: "from-primary to-sky-600",
    };
  };

  const timeContent = getDynamicContent();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${timeContent.bgGradient} p-6 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-500`}
    >
      <div className="absolute -right-6 -top-6 opacity-10 rotate-12">
        <Star size={140} />
      </div>

      <div className="mb-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
          {gregorian}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-accent shrink-0" />
        <p className="font-amiri text-2xl font-bold text-white leading-tight">
          {finalHijri}
        </p>
      </div>

      <div className="mt-4 flex flex-col items-center border-t border-white/10 pt-4 animate-in fade-in duration-500">
        <div className="mb-1">{timeContent.icon}</div>
        <p className="font-amiri text-xl font-bold text-accent drop-shadow-sm text-center">
          {timeContent.text}
        </p>
      </div>
    </div>
  );
};

export default DateHeader;
