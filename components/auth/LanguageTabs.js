const LANGS = [
  {
    code: "en",
    label: "EN",
    flag: "https://purecatamphetamine.github.io/country-flag-icons/3x2/GB.svg",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "https://purecatamphetamine.github.io/country-flag-icons/3x2/KW.svg",
  },
  {
    code: "fr",
    label: "Français",
    flag: "https://purecatamphetamine.github.io/country-flag-icons/3x2/FR.svg",
  },
  {
    code: "ur",
    label: "اردو",
    flag: "https://purecatamphetamine.github.io/country-flag-icons/3x2/PK.svg",
  },
];

export default function LanguageTabs({ active, onChange }) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {LANGS.map((lang) => {
        const selected = active === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={`group flex h-[58px] flex-col items-center justify-center rounded-[14px] border transition-all duration-200 sm:h-[64px] ${
              selected
                ? "border-[#8B5CF6] bg-[#F5F3FF] shadow-[0_8px_20px_rgba(139,92,246,0.12)]"
                : "border-slate-100 bg-[#F8FAFC] hover:border-slate-200 hover:bg-white"
            }`}
          >
            {/* Real Flag Image */}
            <div className="mb-1.5 h-3 w-5 overflow-hidden rounded-[2px] shadow-sm sm:h-4 sm:w-6">
              <img
                src={lang.flag}
                alt={lang.label}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Language Text */}
            <span
              className={`text-[12px] font-bold tracking-tight sm:text-[13px] ${
                selected
                  ? "text-[#6D28D9]"
                  : "text-slate-500 group-hover:text-slate-700"
              }`}
            >
              {lang.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
