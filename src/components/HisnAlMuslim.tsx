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
    categoryAr: "أذكار الصباح",
    categoryEn: "Morning Adhkar",
    icon: <SunMedium className="text-orange-400" />,
    items: [
      {
        textAr:
          "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ للهِ، وَالحَمْدُ للهِ، لاَ إِلَهَ إلاَّ اللهُ وَحْدَهُ لاَ شريكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        textEn:
          "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. There is none worthy of worship but Allah alone, without partner.",
      },
      {
        textAr:
          "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور.",
        textEn:
          "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and unto You is the resurrection.",
      },
      {
        textAr:
          "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي فاغفر لي فإنه لا يغفر الذنوب إلا أنت.",
        textEn:
          "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your slave. I abide by Your covenant and promise as best I can.",
      },
      {
        textAr:
          "اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ.",
        textEn:
          "Allah! There is no god but He, the Living, the Self-subsisting. Neither slumber nor sleep seizes Him. To Him belongs whatever is in the heavens and whatever is on the earth.",
      },
      {
        textAr:
          "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ. (3 مرات)",
        textEn:
          "In the Name of Allah with Whose Name nothing is harmed on Earth nor in the heaven, and He is the All-Hearing, the All-Knowing. (3 times)",
      },
      {
        textAr:
          "يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.",
        textEn:
          "O Ever Living One, O Eternal One, by Your mercy I call on You to set right all my affairs. Do not leave me to myself even for the blink of an eye.",
      },
    ],
  },
  {
    id: 2,
    categoryAr: "أذكار المساء",
    categoryEn: "Evening Adhkar",
    icon: <CloudMoon className="text-blue-500" />,
    items: [
      {
        textAr:
          "أَمْسَيْنَا وَأَمْسَى المُلْكُ للهِ، وَالحَمْدُ للهِ، لاَ إِلَهَ إلاَّ اللهُ وَحْدَهُ لاَ شريكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        textEn:
          "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah.",
      },
      {
        textAr:
          "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.",
        textEn:
          "O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and unto You is the final return.",
      },
      {
        textAr: "أعوذ بكلمات الله التامات من شر ما خلق. (3 مرات)",
        textEn:
          "I seek refuge in the perfect words of Allah from the evil of what He has created. (3 times)",
      },
      {
        textAr:
          "اللهم إنا نعوذ بك من أن نشرك بك شيئاً نعلمه، ونستغفرك لما لا نعلمه.",
        textEn:
          "O Allah, we seek refuge in You from knowingly associating anything with You, and we seek Your forgiveness for that which we do not know.",
      },
    ],
  },
  {
    id: 3,
    categoryAr: "الهم والكرب والحزن",
    categoryEn: "Grief & Anxiety",
    icon: <HelpCircle className="text-amber-600" />,
    items: [
      {
        textAr:
          "لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم، لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.",
        textEn:
          "There is no deity but Allah, the Great, the Forbearing. There is no deity but Allah, Lord of the Magnificent Throne.",
      },
      {
        textAr: "لا إله إلا أنت سبحانك إني كنت من الظالمين.",
        textEn:
          "There is no deity but You. Glory be to You! I have been among the wrongdoers.",
      },
      {
        textAr: "يا حي يا قيوم برحمتك أستغيث.",
        textEn:
          "O Ever Living One, O Eternal One, by Your mercy I call on You.",
      },
    ],
  },
  {
    id: 4,
    categoryAr: "السفر وركوب السيارة",
    categoryEn: "Travel & Riding",
    icon: <Car className="text-sky-500" />,
    items: [
      {
        textAr:
          "سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون.",
        textEn:
          "Glory is to Him Who has provided this for us, though we could never have subdued it by ourselves.",
      },
      {
        textAr:
          "اللهم إنا نسألك في سفرنا هذا البر والتقوى، ومن العمل ما ترضى، اللهم هون علينا سفرنا هذا واطوِ عنا بعده.",
        textEn:
          "O Allah, we ask You on this journey of ours for goodness and piety, and for works that are pleasing to You.",
      },
    ],
  },
  {
    id: 5,
    categoryAr: "المطر والرعد والريح",
    categoryEn: "Nature (Rain & Wind)",
    icon: <CloudRain className="text-cyan-500" />,
    items: [
      {
        textAr: "اللهم صيباً نافعاً.",
        textEn: "O Allah, may it be a beneficial rain.",
      },
      {
        textAr: "سبحان الذي يسبح الرعد بحمده والملائكة من خيفته.",
        textEn:
          "Glory is to Him Whom the thunder glorifies with His praise and the angels glorify Him from fear of Him.",
      },
    ],
  },
  {
    id: 6,
    categoryAr: "أذكار المنزل والمسجد",
    categoryEn: "Home & Mosque",
    icon: <DoorOpen className="text-stone-500" />,
    items: [
      {
        textAr:
          "بِسْـمِ اللهِ وَلَجْنـا، وَبِسْـمِ اللهِ خَـرَجْنـا، وَعَلـى رَبِّنـا تَوَكَّلْـنا.",
        textEn:
          "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we rely.",
      },
      {
        textAr: "اللهم افتح لي أبواب رحمتك.",
        textEn: "O Allah, open the gates of Your mercy for me.",
      },
    ],
  },
  {
    id: 7,
    categoryAr: "أدعية الحرب والشدائد",
    categoryEn: "Hardship & Fear",
    icon: <ShieldAlert className="text-red-600" />,
    items: [
      {
        textAr: "حسبنا الله ونعم الوكيل.",
        textEn:
          "Allah is sufficient for us and He is the best Disposer of affairs.",
      },
      {
        textAr: "اللهم اكفناهم بما شئت.",
        textEn: "O Allah, suffice us against them as You will.",
      },
    ],
  },
  {
    id: 8,
    categoryAr: "جوامع الدعاء والوالدين",
    categoryEn: "General Dua",
    icon: <Sparkles className="text-pink-500" />,
    items: [
      {
        textAr: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا.",
        textEn:
          "My Lord, have mercy upon them as they brought me up when I was small.",
      },
      {
        textAr: "اللهم إنك عفو تحب العفو فاعف عني.",
        textEn:
          "O Allah, You are Forgiving and You love forgiveness, so forgive me.",
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
