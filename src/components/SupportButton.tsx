import { Coffee, Heart } from "lucide-react";

const SupportButton = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 mt-8 bg-emerald-900/20 rounded-2xl border border-emerald-500/30">
      <div className="text-center">
        <p className="text-emerald-100 font-medium mb-1">هل أعجبك التطبيق؟</p>
        <p className="text-emerald-400 text-sm">
          دعمك يساعدنا على التطوير والاستمرار
        </p>
      </div>

      <a
        href="https://www.buymeacoffee.com/osamasife" // تأكد من إنشاء حساب بهذا الاسم
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#FFDD00] hover:bg-[#ffea5c] text-black px-6 py-3 rounded-full font-bold transition-transform hover:scale-105 shadow-lg"
      >
        <Coffee size={20} />
        <span>ادعم المشروع بقهوة</span>
      </a>

      <div className="flex items-center gap-1 text-xs text-emerald-500/60">
        <span>صُنع بكل</span>
        <Heart size={12} className="fill-emerald-500" />
        <span>في جدة</span>
      </div>
    </div>
  );
};

export default SupportButton;
