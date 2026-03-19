import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const steps = [
  { title: "Make Wudu", desc: "Perform ablution (wudu) to purify yourself before the prayer." },
  { title: "Pray Two Rak'ahs", desc: "Pray two voluntary rak'ahs of prayer. It is recommended to recite Surah Al-Kafirun in the first rak'ah and Surah Al-Ikhlas in the second." },
  { title: "Recite the Istikhara Dua", desc: "After completing the two rak'ahs, recite the Istikhara supplication with sincerity and conviction." },
  { title: "Trust in Allah", desc: "After making the dua, proceed with your decision. Trust that Allah will guide you to what is best. Signs may come through feelings, circumstances, or dreams." },
];

const duaArabic = `اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ`;

const duaTranslation = `"O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. You have power, I have none. And You know, I know not. You are the Knower of hidden things."`;

const IstikharaGuide = () => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
        <h3 className="font-amiri text-lg font-bold text-accent">
          Salat Al-Istikhara
        </h3>
        <p className="mt-1 text-sm opacity-80">
          The prayer of seeking guidance from Allah when facing an important decision.
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                {i + 1}
              </span>
              <span className="flex-1 font-medium text-foreground">{step.title}</span>
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
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
          The Dua
        </h4>
        <p className="font-amiri text-right text-xl leading-loose text-foreground" dir="rtl">
          {duaArabic}
        </p>
        <hr className="my-4 border-border" />
        <p className="text-sm italic leading-relaxed text-muted-foreground">
          {duaTranslation}
        </p>
      </div>
    </div>
  );
};

export default IstikharaGuide;
