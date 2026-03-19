import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

const duaArabic = `اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ`;

const stepKeys = [
  { titleKey: "makeWudu", descKey: "makeWuduDesc" },
  { titleKey: "prayTwoRakahs", descKey: "prayTwoRakahsDesc" },
  { titleKey: "reciteDua", descKey: "reciteDuaDesc" },
  { titleKey: "trustAllah", descKey: "trustAllahDesc" },
] as const;

const IstikharaGuide = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
        <h3 className="font-amiri text-lg font-bold text-accent">
          {t("salatIstikhara")}
        </h3>
        <p className="mt-1 text-sm opacity-80">
          {t("istikharaDesc")}
        </p>
      </div>

      <div className="space-y-3">
        {stepKeys.map((step, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="flex w-full items-center gap-3 p-4 text-start"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <span className="flex-1 font-medium text-foreground">{t(step.titleKey)}</span>
              <ChevronDown
                size={18}
                className={cn(
                  "text-muted-foreground transition-transform",
                  expandedStep === i && "rotate-180"
                )}
              />
            </button>
            {expandedStep === i && (
              <div className="border-t border-border px-4 pb-4 pt-3">
                <p className="text-sm text-muted-foreground">{t(step.descKey)}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
          {t("theDua")}
        </h4>
        <p className="font-amiri text-right text-xl leading-loose text-foreground" dir="rtl">
          {duaArabic}
        </p>
        <hr className="my-4 border-border" />
        <p className="text-sm italic leading-relaxed text-muted-foreground">
          {t("duaTranslation")}
        </p>
      </div>
    </div>
  );
};

export default IstikharaGuide;
