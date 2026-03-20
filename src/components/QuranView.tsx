import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Pause, BookOpenText, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
}

interface Ayah {
  numberInSurah: number;
  text: string;
  audio: string;
}

const QuranView = () => {
  const { lang } = useLanguage();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingFull, setPlayingFull] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullPlayIndexRef = useRef<number>(0);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((d) => setSurahs(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const normalizeText = (text: string) => {
    return text
      .replace(/[\u064B-\u0652]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .toLowerCase();
  };

  const filteredSurahs = surahs.filter((s) => {
    const normalizedQuery = normalizeText(searchQuery);
    return (
      normalizeText(s.name).includes(normalizedQuery) ||
      s.englishName.toLowerCase().includes(normalizedQuery) ||
      s.number.toString() === searchQuery
    );
  });

  const openSurah = async (surah: Surah) => {
    stopAll();
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`,
      );
      const data = await res.json();
      setAyahs(data.data?.ayahs || []);
    } catch (e) {
      console.error("Error fetching ayahs", e);
    }
    setLoadingAyahs(false);
  };

  // --- دالة الإيقاف المحسنة ---
  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null; // أهم خطوة: إلغاء الحدث قبل مسح المصدر
      audioRef.current.src = "";
      audioRef.current.load(); // إجبار المتصفح على تفريغ الملف
    }
    setPlayingAyah(null);
    setPlayingFull(false);
    fullPlayIndexRef.current = -1;
  };

  const playAyahAt = (index: number, isContinuous: boolean) => {
    if (index >= ayahs.length || index < 0) {
      stopAll();
      return;
    }

    const ayah = ayahs[index];

    // إيقاف أي صوت سابق وتنظيفه
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }

    const audio = new Audio(ayah.audio);
    audio.preload = "auto";
    audioRef.current = audio;
    setPlayingAyah(ayah.numberInSurah);

    audio.play().catch(() => {
      if (isContinuous) playAyahAt(index + 1, true);
    });

    audio.onended = () => {
      // التحقق من حالة التشغيل المستمر قبل الانتقال للآية التالية
      if (isContinuous && fullPlayIndexRef.current !== -1) {
        const nextIndex = index + 1;
        fullPlayIndexRef.current = nextIndex;
        playAyahAt(nextIndex, true);
      } else {
        setPlayingAyah(null);
        setPlayingFull(false);
      }
    };
  };

  const toggleFullPlay = () => {
    if (playingFull) {
      stopAll();
    } else {
      setPlayingFull(true);
      fullPlayIndexRef.current = 0;
      playAyahAt(0, true);
    }
  };

  const handleSingleAyahToggle = (index: number, ayahNumber: number) => {
    if (playingAyah === ayahNumber) {
      stopAll();
    } else {
      setPlayingFull(false); // نضمن إيقاف التشغيل المستمر
      playAyahAt(index, false); // تشغيل آية واحدة فقط
    }
  };

  if (selectedSurah) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <button
          onClick={() => {
            stopAll();
            setSelectedSurah(null);
          }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> {lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="text-center space-y-2">
          <h2 className="font-amiri text-3xl font-bold text-primary">
            {selectedSurah.name}
          </h2>
          <button
            onClick={toggleFullPlay}
            className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform active:scale-95"
          >
            {playingFull ? <Pause size={18} /> : <Play size={18} />}
            {playingFull
              ? lang === "ar"
                ? "إيقاف التشغيل"
                : "Stop"
              : lang === "ar"
                ? "استماع للسورة"
                : "Listen to Surah"}
          </button>
        </div>

        {loadingAyahs ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)] px-2">
            <div className="space-y-3 pb-10">
              {ayahs.map((ayah, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${playingAyah === ayah.numberInSurah ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full">
                      {ayah.numberInSurah}
                    </span>
                    <button
                      onClick={() =>
                        handleSingleAyahToggle(i, ayah.numberInSurah)
                      }
                      className="text-primary p-1.5 hover:bg-primary/10 rounded-full transition-colors"
                    >
                      {playingAyah === ayah.numberInSurah ? (
                        <Pause size={18} />
                      ) : (
                        <Play size={18} />
                      )}
                    </button>
                  </div>
                  <p
                    className="text-right font-amiri text-2xl leading-[1.8] text-foreground"
                    dir="rtl"
                  >
                    {ayah.text}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <BookOpenText size={28} />
        </div>
        <div>
          <h1 className="font-amiri text-2xl font-bold">
            {lang === "ar" ? "القرآن الكريم" : "Holy Quran"}
          </h1>
          <p className="text-xs text-muted-foreground">
            بصوت الشيخ مشاري العفاسي
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          placeholder={
            lang === "ar" ? "ابحث باسم السورة..." : "Search surah..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-2xl bg-card"
        />
        {searchQuery && (
          <X
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            size={16}
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="grid grid-cols-1 gap-3">
          {filteredSurahs.map((s) => (
            <button
              key={s.number}
              onClick={() => openSurah(s)}
              className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 flex items-center justify-center bg-secondary text-secondary-foreground rounded-xl text-xs font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {s.number}
                </span>
                <div className="text-left">
                  <span className="text-sm font-bold block">
                    {s.englishName}
                  </span>
                </div>
              </div>
              <span className="font-amiri font-bold text-xl">{s.name}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default QuranView;
