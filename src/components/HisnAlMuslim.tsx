import { useState } from "react";
import {
  ArrowRight,
  SunMedium,
  CloudMoon,
  CloudRain,
  ShieldAlert,
  Car,
  MapPin,
  DoorOpen,
  HelpCircle,
  Sparkles,
  Search,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AdhkarItem {
  textAr: string;
  textEn: string;
}

interface AdhkarCategory {
  id: number;
  categoryAr: string;
  categoryEn: string;
  icon: JSX.Element;
  items: AdhkarItem[];
}

const ADHKAR_DATA: AdhkarCategory[] = [
  {
    id: 1,
    categoryAr: "أذكار الصباح (كاملة)",
    categoryEn: "Morning Adhkar (Full)",
    icon: <SunMedium className="text-orange-400" />,
    items: [
      {
        textAr: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ للهِ، وَالحَمْدُ للهِ...",
        textEn:
          "We have reached the morning and at this very time unto Allah belongs all sovereignty...",
      },
      {
        textAr: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك...",
        textEn:
          "O Allah, You are my Lord, there is none worthy of worship but You...",
      },
      {
        textAr:
          "اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ (آية الكرسي)",
        textEn:
          "Allah! There is no god but He, the Living, the Self-subsisting...",
      },
      {
        textAr: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ...",
        textEn: "In the Name of Allah with Whose Name nothing is harmed...",
      },
    ],
  },
  {
    id: 2,
    categoryAr: "أذكار المساء (كاملة)",
    categoryEn: "Evening Adhkar (Full)",
    icon: <CloudMoon className="text-blue-500" />,
    items: [
      {
        textAr: "أَمْسَيْنَا وَأَمْسَى المُلْكُ للهِ، وَالحَمْدُ للهِ...",
        textEn:
          "We have reached the evening and at this very time unto Allah belongs all sovereignty...",
      },
      {
        textAr: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا...",
        textEn:
          "O Allah, by You we enter the evening and by You we enter the morning...",
      },
    ],
  },
  {
    id: 3,
    categoryAr: "أدعية الحرب والشدائد والخوف",
    categoryEn: "Dua for Hardship & Fear",
    icon: <ShieldAlert className="text-red-600" />,
    items: [
      {
        textAr: "حسبنا الله ونعم الوكيل.",
        textEn:
          "Allah is sufficient for us and He is the best Disposer of affairs.",
      },
      {
        textAr: "اللهم إنا نجعلك في نحورهم، ونعوذ بك من شرورهم.",
        textEn:
          "O Allah, we ask You to restrain them by their necks and we seek refuge in You from their evil.",
      },
    ],
  },
  {
    id: 4,
    categoryAr: "المطر والرعد والريح",
    categoryEn: "Rain, Thunder & Wind",
    icon: <CloudRain className="text-cyan-500" />,
    items: [
      {
        textAr: "اللهم صيباً نافعاً.",
        textEn: "O Allah, may it be a beneficial rain.",
      },
      {
        textAr: "سبحان الذي يسبح الرعد بحمده.",
        textEn: "Glory is to Him Whom the thunder glorifies with His praise.",
      },
    ],
  },
  {
    id: 5,
    categoryAr: "السفر وركوب السيارة",
    categoryEn: "Travel & Riding",
    icon: <Car className="text-sky-500" />,
    items: [
      {
        textAr: "سبحان الذي سخر لنا هذا وما كنا له مقرنين.",
        textEn:
          "Glory to Him Who has brought this [vehicle] under our control.",
      },
      {
        textAr: "اللهم أنت الصاحب في السفر والخليفة في الأهل.",
        textEn:
          "O Allah, You are the Companion on the journey and the Successor over the family.",
      },
    ],
  },
  {
    id: 6,
    categoryAr: "الحج والعمرة",
    categoryEn: "Hajj & Umrah",
    icon: <MapPin className="text-emerald-600" />,
    items: [
      {
        textAr: "لبيك اللهم لبيك، لبيك لا شريك لك لبيك.",
        textEn: "I am at Your service, O Allah, I am at Your service.",
      },
    ],
  },
  {
    id: 7,
    categoryAr: "أذكار المنزل والمسجد",
    categoryEn: "Home & Mosque Adhkar",
    icon: <DoorOpen className="text-stone-500" />,
    items: [
      {
        textAr: "بسم الله ولجنا، وبسم الله خرجنا.",
        textEn:
          "In the name of Allah we enter, and in the name of Allah we leave.",
      },
    ],
  },
  {
    id: 8,
    categoryAr: "الهم والكرب والحزن",
    categoryEn: "Dua for Grief & Anxiety",
    icon: <HelpCircle className="text-amber-600" />,
    items: [
      {
        textAr: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
        textEn:
          "There is no deity but You. Glory be to You! I have been among the wrongdoers.",
      },
    ],
  },
  {
    id: 9,
    categoryAr: "جوامع الدعاء والوالدين",
    categoryEn: "General Dua & Parents",
    icon: <Sparkles className="text-pink-500" />,
    items: [
      {
        textAr: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا.",
        textEn:
          "My Lord, have mercy upon them as they brought me up [when I was] small.",
      },
    ],
  },
];

const HisnAlMuslim = () => {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] =
    useState<AdhkarCategory | null>(null);

  if (selectedCategory) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowRight size={18} className={lang === "ar" ? "" : "rotate-180"} />
          {lang === "ar" ? "العودة للقائمة" : "Back to List"}
        </button>

        <div className="flex items-center gap-4 p-5 bg-white rounded-[2rem] border border-black/[0.03] shadow-[0_8px_20px_rgba(0,0,0,0.04)]">
          <div className="p-3 bg-secondary/50 rounded-2xl">
            {selectedCategory.icon}
          </div>
          <h2
            className={cn(
              "text-xl font-bold",
              lang === "ar" ? "font-amiri" : "",
            )}
          >
            {lang === "ar"
              ? selectedCategory.categoryAr
              : selectedCategory.categoryEn}
          </h2>
        </div>

        <ScrollArea className="h-[60vh] pr-2">
          <div className="space-y-4 pb-16">
            {selectedCategory.items.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-[1.8rem] bg-white border border-black/[0.02] shadow-[0_4px_15px_rgba(0,0,0,0.03)]"
              >
                <p
                  className={cn(
                    "leading-relaxed",
                    lang === "ar"
                      ? "text-right font-amiri text-2xl"
                      : "text-left text-lg",
                  )}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  {lang === "ar" ? item.textAr : item.textEn}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-24 animate-in fade-in duration-500">
      {ADHKAR_DATA.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat)}
          className="flex items-center justify-between p-5 rounded-[2rem] bg-white border border-black/[0.03] shadow-[0_5px_15px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-1 transition-all group active:scale-[0.98]"
        >
          <div className="flex items-center gap-5">
            <div className="p-4 bg-secondary/30 rounded-[1.2rem] group-hover:bg-primary/10 transition-colors">
              {cat.icon}
            </div>
            <span
              className={cn(
                "font-bold text-lg",
                lang === "ar" ? "font-amiri" : "",
              )}
            >
              {lang === "ar" ? cat.categoryAr : cat.categoryEn}
            </span>
          </div>
          <ArrowRight
            size={20}
            className={cn(
              "text-muted-foreground group-hover:text-primary transition-all",
              lang === "ar" ? "" : "rotate-180",
            )}
          />
        </button>
      ))}
    </div>
  );
};

export default HisnAlMuslim;
