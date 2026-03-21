import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  BookOpenText,
  Search,
  X,
  Bookmark,
  CircleStop,
  ListMusic,
  RotateCcw,
  Hash,
} from "lucide-react";
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
  const [ayahSearchQuery, setAyahSearchQuery] = useState(""); // بحث الآيات
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingFull, setPlayingFull] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullPlayIndexRef = useRef<number>(0);
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [lastSaved, setLastSaved] = useState<{
    surah: Surah;
    index: number;
  } | null>(null);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((d) => setSurahs(d.data || []))
      .catch((err) => console.error("Error fetching surahs:", err))
      .finally(() => setLoading(false));

    const savedSurah = localStorage.getItem("lastReadSurah");
    const savedIndex = localStorage.getItem("lastReadAyahIndex");
    if (savedSurah && savedIndex) {
      try {
        setLastSaved({
          surah: JSON.parse(savedSurah),
          index: parseInt(savedIndex),
        });
      } catch (e) {
        console.error("Error parsing saved surah", e);
      }
    }
  }, []);

  const normalizeText = (text: string | undefined | null) => {
    if (!text) return "";
    return text
      .replace(/[\u064B-\u0652]/g, "")
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .toLowerCase()
      .trim();
  };

  const filteredSurahs = (surahs || []).filter((s) => {
    if (!s) return false;
    const normalizedQuery = normalizeText(searchQuery);
    return (
      normalizeText(s.name).includes(normalizedQuery) ||
      (s.englishName || "").toLowerCase().includes(normalizedQuery) ||
      s.number.toString() === searchQuery
    );
  });

  const stopAll = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
      audioRef.current.src = "";
    }
    setPlayingAyah(null);
    setPlayingFull(false);
    setIsPaused(false);
    fullPlayIndexRef.current = -1;
  };

  const togglePause = () => {
    if (!audioRef.current) return;
    if (isPaused) {
      audioRef.current.play().catch(console.error);
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  const scrollToAyah = (index: number) => {
    setTimeout(() => {
      const element = ayahRefs.current[index];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        // إضافة تأثير وميض (Glow) بسيط للآية التي تم البحث عنها
        element.classList.add("ring-2", "ring-primary", "ring-offset-2");
        setTimeout(() => {
          element.classList.remove("ring-2", "ring-primary", "ring-offset-2");
        }, 2000);
      }
    }, 100);
  };

  // دالة البحث عن آية محددة بالتمرير
  const handleAyahSearch = (val: string) => {
    setAyahSearchQuery(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0 && num <= ayahs.length) {
      scrollToAyah(num - 1);
    }
  };

  const openSurah = async (surah: Surah, autoPlayIndex?: number) => {
    stopAll();
    setSelectedSurah(surah);
    setAyahSearchQuery(""); // تصغير بحث الآيات عند فتح سورة جديدة
    setLoadingAyahs(true);
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`,
      );
      const data = await res.json();
      const fetchedAyahs = data.data?.ayahs || [];
      setAyahs(fetchedAyahs);

      if (autoPlayIndex !== undefined) {
        scrollToAyah(autoPlayIndex);
        setTimeout(() => {
          setPlayingFull(true);
          fullPlayIndexRef.current = autoPlayIndex;
          playAyahAt(autoPlayIndex, true, fetchedAyahs, surah);
        }, 1500);
      }
    } catch (e) {
      console.error("Error fetching ayahs", e);
    }
    setLoadingAyahs(false);
  };

  const playAyahAt = (
    index: number,
    isContinuous: boolean,
    currentAyahs = ayahs,
    currentSurah = selectedSurah,
  ) => {
    if (!currentAyahs || index >= currentAyahs.length || index < 0) {
      stopAll();
      return;
    }

    const ayah = currentAyahs[index];
    if (isContinuous) {
      scrollToAyah(index);
    }

    if (currentSurah) {
      localStorage.setItem("lastReadSurah", JSON.stringify(currentSurah));
      localStorage.setItem("lastReadAyahIndex", index.toString());
      setLastSaved({ surah: currentSurah, index });
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended = null;
    }

    const audio = new Audio(ayah.audio);
    audioRef.current = audio;
    setPlayingAyah(ayah.numberInSurah);
    setIsPaused(false);

    setTimeout(() => {
      audio.play().catch((err) => {
        console.error("Audio play error:", err);
        if (isContinuous)
          playAyahAt(index + 1, true, currentAyahs, currentSurah);
      });
    }, 400);

    audio.onended = () => {
      if (isContinuous && fullPlayIndexRef.current !== -1) {
        const nextIndex = index + 1;
        fullPlayIndexRef.current = nextIndex;
        playAyahAt(nextIndex, true, currentAyahs, currentSurah);
      } else {
        setPlayingAyah(null);
        setPlayingFull(false);
      }
    };
  };

  const handleAyahAction = (
    index: number,
    ayahNumber: number,
    continuous: boolean,
  ) => {
    if (playingAyah === ayahNumber && playingFull === continuous) {
      togglePause();
    } else {
      setPlayingFull(continuous);
      if (continuous) fullPlayIndexRef.current = index;
      playAyahAt(index, continuous);
    }
  };

  if (selectedSurah) {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              stopAll();
              setSelectedSurah(null);
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} /> {lang === "ar" ? "رجوع" : "Back"}
          </button>

          {/* شريط البحث عن آية - يظهر فقط داخل السورة */}
          <div className="relative w-32 animate-in slide-in-from-right-2">
            <Hash
              className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={14}
            />
            <Input
              type="number"
              placeholder={lang === "ar" ? "رقم الآية" : "Ayah "}
              value={ayahSearchQuery}
              onChange={(e) => handleAyahSearch(e.target.value)}
              className="pl-7 h-8 text-xs rounded-full bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h2 className="font-amiri text-3xl font-bold text-primary">
            {selectedSurah.name}
          </h2>

          <div className="flex items-center justify-center gap-3">
            {!playingFull ? (
              <button
                onClick={() => {
                  setPlayingFull(true);
                  fullPlayIndexRef.current = 0;
                  playAyahAt(0, true);
                }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all"
              >
                <Play size={18} />{" "}
                {lang === "ar" ? "استماع للسورة" : "Listen to Surah"}
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all"
                >
                  {isPaused ? <Play size={18} /> : <Pause size={18} />}
                  {isPaused
                    ? lang === "ar"
                      ? "استئناف"
                      : "Resume"
                    : lang === "ar"
                      ? "إيقاف مؤقت"
                      : "Pause"}
                </button>
                <button
                  onClick={stopAll}
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all"
                >
                  <CircleStop size={18} /> {lang === "ar" ? "إنهاء" : "Stop"}
                </button>
              </>
            )}
          </div>
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
                  ref={(el) => (ayahRefs.current[i] = el)}
                  className={`p-5 rounded-2xl border transition-all duration-300 ${playingAyah === ayah.numberInSurah ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card"}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full">
                      {ayah.numberInSurah}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleAyahAction(i, ayah.numberInSurah, false)
                        }
                        className={`p-1.5 rounded-full transition-colors ${playingAyah === ayah.numberInSurah && !playingFull ? "bg-primary text-white" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}
                      >
                        {playingAyah === ayah.numberInSurah && !playingFull ? (
                          isPaused ? (
                            <Play size={18} />
                          ) : (
                            <Pause size={18} />
                          )
                        ) : (
                          <RotateCcw size={18} />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          handleAyahAction(i, ayah.numberInSurah, true)
                        }
                        className={`p-1.5 rounded-full transition-colors ${playingAyah === ayah.numberInSurah && playingFull ? "bg-primary text-white" : "text-primary hover:bg-primary/10"}`}
                      >
                        {playingAyah === ayah.numberInSurah && playingFull ? (
                          isPaused ? (
                            <Play size={18} />
                          ) : (
                            <Pause size={18} />
                          )
                        ) : (
                          <ListMusic size={18} />
                        )}
                      </button>
                    </div>
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

      {lastSaved && (
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Bookmark size={16} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                {lang === "ar" ? "واصل القراءة" : "Continue Reading"}
              </p>
              <p className="font-bold text-sm">
                {lastSaved.surah.name}{" "}
                <span className="text-primary mx-1">|</span>{" "}
                {lang === "ar"
                  ? `آية ${lastSaved.index + 1}`
                  : `Ayah ${lastSaved.index + 1}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => openSurah(lastSaved.surah, lastSaved.index)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
          >
            {lang === "ar" ? "استكمال" : "Continue"}
          </button>
        </div>
      )}

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
              className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:border-primary transition-all group"
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
