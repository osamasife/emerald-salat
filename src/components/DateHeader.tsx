import { Star, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DateHeader = () => {
  const { lang } = useLanguage();
  const today = new Date();

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

  // 2. التاريخ الهجري (مع معالجة تكرار "هـ")
  let hijriDate = new Intl.DateTimeFormat(
    lang === "ar"
      ? "ar-SA-u-ca-islamic-umalqura"
      : "en-US-u-ca-islamic-umalqura",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(today);

  // تنظيف النص: إذا كان التاريخ يحتوي بالفعل على "هـ" أو "AH"، لا نضيفها مرة أخرى
  const hasSuffix = hijriDate.includes("هـ") || hijriDate.includes("AH");
  const finalHijri = hasSuffix
    ? hijriDate
    : `${hijriDate} ${lang === "ar" ? "هـ" : "AH"}`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300">
      {/* زخرفة خلفية */}
      <div className="absolute -right-6 -top-6 opacity-10 rotate-12">
        <Star size={140} />
      </div>

      {/* التاريخ الميلادي - خط أصغر وشفافية بسيطة */}
      <div className="mb-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
          {gregorian}
        </p>
      </div>

      {/* التاريخ الهجري - واضح وأنيق */}
      <div className="flex items-center gap-2">
        <Calendar size={18} className="text-accent shrink-0" />
        <p className="font-amiri text-2xl font-bold text-white leading-tight">
          {finalHijri}
        </p>
      </div>

      {/* البسملة - بلون ذهبي (Accent) وخط واضح جداً */}
      <div className="mt-4 flex flex-col items-center border-t border-white/10 pt-4">
        <p className="font-amiri text-2xl font-bold text-accent drop-shadow-sm">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
        </p>
      </div>
    </div>
  );
};

export default DateHeader;
