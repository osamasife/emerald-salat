import { useState } from "react";
import {
  ArrowRight,
  Moon,
  Sun,
  Stars,
  ShieldCheck,
  Heart,
  Plane,
  MapPin,
  Car,
  HelpCircle,
  Users,
  SunMedium,
  CloudMoon,
  CloudRain,
  ShieldAlert,
  DoorOpen,
  LogOut,
  Coffee,
  Landmark,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AdhkarItem {
  text: string;
}

interface AdhkarCategory {
  id: number;
  category: string;
  icon: JSX.Element;
  items: AdhkarItem[];
}

const ADHKAR_DATA: AdhkarCategory[] = [
  {
    id: 1,
    category: "أذكار الصباح (كاملة)",
    icon: <SunMedium className="text-orange-400" />,
    items: [
      {
        text: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ للهِ، وَالحَمْدُ للهِ، لاَ إِلَهَ إلاَّ اللهُ وَحْدَهُ لاَ شريكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
      },
      {
        text: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي فاغفر لي فإنه لا يغفر الذنوب إلا أنت (سيد الاستغفار).",
      },
      {
        text: "اللّهُ لاَ إِلَـهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ (آية الكرسي).",
      },
      {
        text: "بِسْمِ اللهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ العَلِيمُ. (3 مرات)",
      },
      {
        text: "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً. (3 مرات)",
      },
      {
        text: "يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.",
      },
      {
        text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت. (3 مرات)",
      },
      {
        text: "أصبحنا على فطرة الإسلام وعلى كلمة الإخلاص وعلى دين نبينا محمد صلى الله عليه وسلم.",
      },
      { text: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً." },
      {
        text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ. (3 مرات)",
      },
    ],
  },
  {
    id: 2,
    category: "أذكار المساء (كاملة)",
    icon: <CloudMoon className="text-blue-500" />,
    items: [
      {
        text: "أَمْسَيْنَا وَأَمْسَى المُلْكُ للهِ، وَالحَمْدُ للهِ، لاَ إِلَهَ إلاَّ اللهُ وَحْدَهُ لاَ شريكَ لَهُ.",
      },
      {
        text: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.",
      },
      { text: "أعوذ بكلمات الله التامات من شر ما خلق. (3 مرات)" },
      {
        text: "اللهم استر عوراتي، وآمن روعاتي، اللهم احفظني من بين يدي، ومن خلفي، وعن يميني، وعن شمالي، ومن فوقي.",
      },
      {
        text: "اللهم عالم الغيب والشهادة فاطر السماوات والأرض، رب كل شيء ومليكه، أشهد أن لا إله إلا أنت.",
      },
      {
        text: "أمسينا على فطرة الإسلام وعلى كلمة الإخلاص وعلى دين نبينا محمد صلى الله عليه وسلم.",
      },
      {
        text: "اللهم إنا نعوذ بك من أن نشرك بك شيئاً نعلمه، ونستغفرك لما لا نعلمه.",
      },
    ],
  },
  {
    id: 3,
    category: "أدعية الحرب والشدائد والخوف",
    icon: <ShieldAlert className="text-red-600" />,
    items: [
      {
        text: "اللهم مُنزل الكتاب، سريع الحساب، اهزم الأحزاب، اللهم اهزمهم وزلزلهم.",
      },
      { text: "حسبنا الله ونعم الوكيل." },
      { text: "اللهم إنا نجعلك في نحورهم، ونعوذ بك من شرورهم." },
      { text: "اللهم أنت عضدي، وأنت نصيري، بك أجول، وبك أصول، وبك أقاتل." },
      {
        text: "ربنا أفرغ علينا صبراً وثبت أقدامنا وانصرنا على القوم الكافرين.",
      },
      {
        text: "اللهم منزل الكتاب ومجري السحاب وهازم الأحزاب اهزمهم وانصرنا عليهم.",
      },
      { text: "اللهم اكفناهم بما شئت." },
    ],
  },
  {
    id: 4,
    category: "المطر والرعد والريح",
    icon: <CloudRain className="text-cyan-500" />,
    items: [
      { text: "عند نزول المطر: اللهم صيباً نافعاً." },
      { text: "بعد نزول المطر: مُطرنا بفضل الله ورحمته." },
      {
        text: "عند سماع الرعد: سبحان الذي يسبح الرعد بحمده والملائكة من خيفته.",
      },
      {
        text: "عند اشتداد الريح: اللهم إني أسألك خيرها، وخير ما فيها، وأعوذ بك من شرها.",
      },
      {
        text: "اللهم حوالينا ولا علينا، اللهم على الآكام والظِّراب وبطون الأودية ومنابت الشجر.",
      },
    ],
  },
  {
    id: 5,
    category: "السفر وركوب السيارة",
    icon: <Car className="text-sky-500" />,
    items: [
      {
        text: "عند ركوب السيارة: بسم الله، الحمد لله، سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون.",
      },
      {
        text: "دعاء السفر: الله أكبر (3 مرات)، اللهم إنا نسألك في سفرنا هذا البر والتقوى.",
      },
      {
        text: "اللهم هون علينا سفرنا هذا واطوِ عنا بعده، اللهم أنت الصاحب في السفر والخليفة في الأهل.",
      },
      {
        text: "اللهم إني أعوذ بك من وعثاء السفر، وكآبة المنظر، وسوء المنقلب في المال والأهل.",
      },
      {
        text: "أعوذ بكلمات الله التامات من شر ما خلق (عند النزول في منزل جديد).",
      },
      { text: "آيبون تائبون عابدون لربنا حامدون (عند العودة)." },
    ],
  },
  {
    id: 6,
    category: "الحج والعمرة",
    icon: <MapPin className="text-emerald-600" />,
    items: [
      {
        text: "لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك.",
      },
      {
        text: "عند رؤية الكعبة: اللهم زد هذا البيت تشريفاً وتعظيماً وتكريماً ومهابة.",
      },
      {
        text: "عند الطواف (بين الركنين): ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.",
      },
      {
        text: "عند شرب ماء زمزم: اللهم إني أسألك علماً نافعاً ورزقاً واسعاً وشفاءً من كل داء.",
      },
      {
        text: "عند الوقوف بعرفة: لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
      },
      { text: "عند المشعر الحرام: الله أكبر الله أكبر لا إله إلا الله." },
    ],
  },
  {
    id: 7,
    category: "أذكار المنزل والمسجد",
    icon: <DoorOpen className="text-stone-500" />,
    items: [
      {
        text: "دخول المنزل: بسم الله ولجنا، وبسم الله خرجنا، وعلى ربنا توكلنا.",
      },
      {
        text: "الخروج من المنزل: بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله.",
      },
      {
        text: "دخول المسجد: بسم الله، والصلاة والسلام على رسول الله، اللهم افتح لي أبواب رحمتك.",
      },
      {
        text: "خروج المسجد: بسم الله، والصلاة والسلام على رسول الله، اللهم إني أسألك من فضلك.",
      },
    ],
  },
  {
    id: 8,
    category: "الهم والكرب والحزن",
    icon: <HelpCircle className="text-amber-600" />,
    items: [
      {
        text: "لا إله إلا الله العظيم الحليم، لا إله إلا الله رب العرش العظيم.",
      },
      { text: "لا إله إلا أنت سبحانك إني كنت من الظالمين." },
      { text: "يا حي يا قيوم برحمتك أستغيث." },
      {
        text: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن.",
      },
      { text: "اللهم رحمتك أرجو فلا تكلني إلى نفسي طرفة عين." },
      { text: "حسبنا الله ونعم الوكيل." },
    ],
  },
  {
    id: 9,
    category: "جوامع الدعاء والوالدين",
    icon: <Sparkles className="text-pink-500" />,
    items: [
      { text: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا." },
      {
        text: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ.",
      },
      { text: "اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل." },
      { text: "اللهم إنك عفو تحب العفو فاعف عني." },
      { text: "يا مقلب القلوب ثبت قلبي على دينك." },
      { text: "اللهم اكفني بحلالك عن حرامك، وأغنني بفضلك عمن سواك." },
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
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowRight size={18} className={lang === "ar" ? "" : "rotate-180"} />
          {lang === "ar" ? "العودة للقائمة" : "Back"}
        </button>

        <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-2xl border border-primary/20">
          <div className="p-2 bg-background rounded-lg shadow-sm">
            {selectedCategory.icon}
          </div>
          <h2 className="text-xl font-bold font-amiri text-foreground">
            {selectedCategory.category}
          </h2>
        </div>

        <ScrollArea className="h-[65vh] pr-2">
          <div className="space-y-4 pb-16">
            {selectedCategory.items.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card border border-border shadow-sm hover:border-primary/20 transition-all"
              >
                <p
                  className="text-right font-amiri text-xl leading-relaxed text-foreground"
                  dir="rtl"
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 pb-24 animate-in fade-in duration-500">
      {ADHKAR_DATA.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat)}
          className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-md transition-all group active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
              {cat.icon}
            </div>
            <span className="font-bold text-foreground">{cat.category}</span>
          </div>
          <ArrowRight
            size={18}
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
