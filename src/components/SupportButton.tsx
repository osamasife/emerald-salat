import { Coffee, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SupportButton = () => {
  const { lang, t } = useLanguage();

  // نصوص الترجمة للزر (بما أننا لم نضفها في ملف الترجمة الرئيسي بعد)
  const content = {
    ar: {
      title: "هل أعجبك التطبيق؟",
      desc: "دعمك يساعدنا على التطوير والاستمرار",
      button: "ادعم المشروع بقهوة",
      madeWith: "صُنع بكل",
      in: "في جدة",
    },
    en: {
      title: "Enjoying the app?",
      desc: "Your support keeps us going",
      button: "Buy me a coffee",
      madeWith: "Made with",
      in: "in Jeddah",
    },
  };

  const current = lang === "ar" ? content.ar : content.en;

  return (
    <div className="flex flex-col items-center gap-4 p-6 mt-8 mb-8 bg-emerald-900/10 rounded-2xl border border-emerald-500/20">
      <div className="text-center">
        <p className="text-emerald-400 font-medium mb-1">{current.title}</p>
        <p className="text-emerald-400/80 text-sm">{current.desc}</p>
      </div>

      <a
        href="https://www.buymeacoffee.com/osamasife"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#FFDD00] hover:bg-[#ffea5c] text-black px-6 py-2.5 rounded-full font-bold transition-transform active:scale-95 shadow-md"
      >
        <Coffee size={18} />
        <span className={lang === "ar" ? "font-amiri" : ""}>
          {current.button}
        </span>
      </a>

      <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest uppercase text-emerald-500/50 pt-2">
        <span>{current.madeWith}</span>
        <Heart size={10} className="fill-emerald-500/50 stroke-none" />
        <span>{current.in}</span>
      </div>
    </div>
  );
};

export default SupportButton;
