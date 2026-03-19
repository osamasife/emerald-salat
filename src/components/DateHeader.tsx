import { useEffect, useState } from "react";
import { Star } from "lucide-react";

const DateHeader = () => {
  const [hijriDate, setHijriDate] = useState("");
  const gregorian = new Date().toLocaleDateString("en-US", {
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
        if (h) setHijriDate(`${h.day} ${h.month.en} ${h.year} AH`);
      })
      .catch(() => setHijriDate(""));
  }, []);

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
