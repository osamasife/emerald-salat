import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DateHeader = () => {
  const { lang } = useLanguage();
  const [hijriDate, setHijriDate] = useState("");
  const gregorian = new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    fetch(`https://api.aladhan.com/v1/gpiToH/${dd}-${mm}-${yyyy}`)
      .then((r) => r.json())
      .then((data) => {
        const h = data?.data?.hijri;
        if (h) {
          const monthName = lang === "ar" ? h.month.ar : h.month.en;
          setHijriDate(`${h.day} ${monthName} ${h.year} ${lang === "ar" ? "هـ" : "AH"}`);
        }
      })
      .catch(() => setHijriDate(""));
  }, [lang]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground">
      <div className="absolute -right-6 -top-6 opacity-10">
        <Star size={120} />
      </div>
      <p className="text-xs font-medium uppercase tracking-widest text-gold-light">
        {gregorian}
      </p>
      {hijriDate && (
        <p className="font-amiri mt-1 text-xl font-bold text-accent">
          {hijriDate}
        </p>
      )}
      <p className="mt-2 font-amiri text-sm italic opacity-80">
        "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
      </p>
    </div>
  );
};

export default DateHeader;
