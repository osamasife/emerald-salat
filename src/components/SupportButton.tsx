import { Coffee, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SupportButton = () => {
  const { lang } = useLanguage();

  const content = {
    ar: {
      title: "دعم المشروع",
      button: "قهوة للمطور",
      madeWith: "صُنع بكل",
      in: "في جدة",
    },
    en: {
      title: "Support Project",
      button: "Buy me a coffee",
      madeWith: "Made with",
      in: "in Jeddah",
    },
  };

  const current = lang === "ar" ? content.ar : content.en;

  return (
    <div className="flex flex-col items-center gap-3 p-4 mt-12 mb-8 bg-transparent border-t border-emerald-500/10">
      <p className="text-emerald-500/40 text-xs tracking-widest uppercase font-medium">
        {current.title}
      </p>

      <a
        href="https://www.buymeacoffee.com/osamasife"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-emerald-100/70 hover:text-emerald-100 border border-emerald-500/20 hover:border-emerald-500/50 px-5 py-2 rounded-xl transition-all duration-300 bg-emerald-500/5 hover:bg-emerald-500/10"
      >
        <Coffee size={16} className="text-emerald-500/60" />
        <span
          className={`text-sm ${lang === "ar" ? "font-amiri" : "font-sans"}`}
        >
          {current.button}
        </span>
      </a>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-emerald-500/30 pt-1">
        <span>{current.madeWith}</span>
        <Heart size={10} className="fill-emerald-500/20 stroke-none" />
        <span>{current.in}</span>
      </div>
    </div>
  );
};

export default SupportButton;
