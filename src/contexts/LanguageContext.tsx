import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type Lang = "en" | "ar";

const translations = {
  en: {
    appName: "Muslim",
    appNameAccent: " Pro",
    home: "Home",
    prayer: "Prayer",
    tasbih: "Dhikr & Tasbih",
    learn: "Learn",
    smartTasbih: "Smart Tasbih",
    tasbihDesc: "Set your target, tap to count, feel the vibration.",
    challenge: "Challenge",
    istikharaLearn: "Learn",
    enterCity: "Enter city...",
    search: "Search",
    target: "Target",
    tap: "Tap",
    reset: "Reset",
    newChallenge: "New Challenge",
    challengeComplete: "Masha'Allah! Challenge Complete!",
    youCompleted: "You completed",
    dhikr: "dhikr",
    quran: "Quran",
    salatIstikhara: "Salat Al-Istikhara",
    istikharaDesc:
      "The prayer of seeking guidance from Allah when facing an important decision.",
    theDua: "The Dua",
    makeWudu: "Make Wudu",
    makeWuduDesc:
      "Perform ablution (wudu) to purify yourself before the prayer.",
    prayTwoRakahs: "Pray Two Rak'ahs",
    prayTwoRakahsDesc:
      "Pray two voluntary rak'ahs of prayer. It is recommended to recite Surah Al-Kafirun in the first rak'ah and Surah Al-Ikhlas in the second.",
    reciteDua: "Recite the Istikhara Dua",
    reciteDuaDesc:
      "After completing the two rak'ahs, recite the Istikhara supplication with sincerity and conviction.",
    trustAllah: "Trust in Allah",
    trustAllahDesc:
      "After making the dua, proceed with your decision. Trust that Allah will guide you to what is best. Signs may come through feelings, circumstances, or dreams.",
    duaTranslation:
      '"O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. You have power, I have none. And You know, I know not. You are the Knower of hidden things."',
  },
  ar: {
    appName: "مسلم",
    appNameAccent: " برو",
    home: "الرئيسية",
    prayer: "الصلاة",
    tasbih: "تسبيح وأذكار",
    learn: "تعلّم",
    smartTasbih: "التسبيح الذكي",
    tasbihDesc: "حدد هدفك، انقر للعد، واشعر بالاهتزاز.",
    challenge: "تحدي",
    istikharaLearn: "تعلّم",
    enterCity: "أدخل المدينة...",
    search: "بحث",
    target: "الهدف",
    tap: "انقر",
    reset: "إعادة",
    newChallenge: "تحدي جديد",
    challengeComplete: "ما شاء الله! اكتمل التحدي!",
    youCompleted: "أكملت",
    dhikr: "ذكر",
    quran: "القرآن",
    salatIstikhara: "صلاة الاستخارة",
    istikharaDesc: "صلاة طلب الهداية من الله عند مواجهة قرار مهم.",
    theDua: "الدعاء",
    makeWudu: "الوضوء",
    makeWuduDesc: "توضأ لتطهير نفسك قبل الصلاة.",
    prayTwoRakahs: "صلاة ركعتين",
    prayTwoRakahsDesc:
      "صلِّ ركعتين نافلتين. يُستحب قراءة سورة الكافرون في الركعة الأولى وسورة الإخلاص في الثانية.",
    reciteDua: "قراءة دعاء الاستخارة",
    reciteDuaDesc: "بعد إتمام الركعتين، اقرأ دعاء الاستخارة بإخلاص ويقين.",
    trustAllah: "التوكل على الله",
    trustAllahDesc:
      "بعد الدعاء، امضِ في قرارك. توكل على أن الله سيهديك إلى الأفضل. قد تأتي العلامات من خلال المشاعر أو الظروف أو الأحلام.",
    duaTranslation:
      '"اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ"',
  },
} as const;

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: keyof typeof translations.en) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const toggleLang = useCallback(
    () => setLang((l) => (l === "en" ? "ar" : "en")),
    [],
  );
  const t = useCallback(
    (key: keyof typeof translations.en) => translations[lang][key],
    [lang],
  );
  const isRTL = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"} className={isRTL ? "font-amiri" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
