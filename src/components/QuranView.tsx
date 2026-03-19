import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Pause, BookOpenText } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio: string;
}

const QuranView = () => {
  const { t, lang } = useLanguage();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [playingFull, setPlayingFull] = useState(false);
  const fullPlayIndexRef = useRef<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((r) => r.json())
      .then((d) => setSurahs(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openSurah = async (surah: Surah) => {
    setSelectedSurah(surah);
    setLoadingAyahs(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`);
      const data = await res.json();
      setAyahs(data.data?.ayahs || []);
    } catch {
      setAyahs([]);
    }
    setLoadingAyahs(false);
  };

  const stopAll = () => {
    audioRef.current?.pause();
    setPlayingAyah(null);
    setPlayingFull(false);
    fullPlayIndexRef.current = -1;
  };

  const toggleAudio = (ayah: Ayah) => {
    if (playingFull) stopAll();
    if (playingAyah === ayah.numberInSurah) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(ayah.audio);
    audioRef.current = audio;
    audio.play();
    setPlayingAyah(ayah.numberInSurah);
    audio.onended = () => setPlayingAyah(null);
  };

  const playFullSurah = () => {
    if (playingFull) {
      stopAll();
      return;
    }
    if (ayahs.length === 0) return;
    setPlayingFull(true);
    fullPlayIndexRef.current = 0;
    playAyahAt(0);
  };

  const playAyahAt = (index: number) => {
    if (index >= ayahs.length) {
      stopAll();
      return;
    }
    const ayah = ayahs[index];
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(ayah.audio);
    audioRef.current = audio;
    setPlayingAyah(ayah.numberInSurah);
    audio.play();
    audio.onended = () => {
      const next = fullPlayIndexRef.current + 1;
      fullPlayIndexRef.current = next;
      playAyahAt(next);
    };
  };

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      fullPlayIndexRef.current = -1;
    };
  }, []);

  if (selectedSurah) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => {
            setSelectedSurah(null);
            setAyahs([]);
            audioRef.current?.pause();
            setPlayingAyah(null);
          }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          {lang === "ar" ? "رجوع" : "Back"}
        </button>

        <div className="text-center space-y-1">
          <h2 className="font-amiri text-2xl font-bold text-foreground">
            {selectedSurah.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedSurah.englishName} — {selectedSurah.englishNameTranslation}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedSurah.numberOfAyahs} {lang === "ar" ? "آية" : "Ayahs"} · {selectedSurah.revelationType}
          </p>
        </div>

        {loadingAyahs ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-3 pb-4">
              {ayahs.map((ayah) => (
                <div
                  key={ayah.number}
                  className="rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {ayah.numberInSurah}
                    </span>
                    <button
                      onClick={() => toggleAudio(ayah)}
                      className="shrink-0 rounded-full bg-accent/20 p-2 text-accent transition-colors hover:bg-accent/30"
                    >
                      {playingAyah === ayah.numberInSurah ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                  <p className="mt-3 text-right font-amiri text-xl leading-loose text-foreground" dir="rtl">
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpenText size={24} className="text-accent" />
        <h1 className="font-amiri text-2xl font-bold text-foreground">
          {lang === "ar" ? "القرآن الكريم" : "Holy Quran"}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">
        {lang === "ar" ? "اختر سورة للقراءة والاستماع" : "Select a Surah to read and listen"}
      </p>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-2 pb-4">
            {surahs.map((surah) => (
              <button
                key={surah.number}
                onClick={() => openSurah(surah)}
                className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-accent hover:shadow-sm"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {surah.number}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {surah.englishName}
                    </span>
                    <span className="font-amiri text-base font-bold text-foreground" dir="rtl">
                      {surah.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">
                      {surah.englishNameTranslation}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {surah.numberOfAyahs} {lang === "ar" ? "آية" : "Ayahs"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default QuranView;
