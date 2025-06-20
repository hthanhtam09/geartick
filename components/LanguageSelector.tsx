"use client";

import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales } from "../i18n";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const languageNames = {
    en: "English",
    vi: "Vietnamese",
  };
  const languageFlags = {
    en: "🇬🇧",
    vi: "🇻🇳",
  };

  const handleLanguageChange = (newLocale: string) => {
    setIsOpen(false);

    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "");

    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 rounded-full p-2 transition-colors hover:bg-accent cursor-pointer"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border bg-background shadow-lg">
          <ul role="listbox" aria-label="Language options">
            {locales.map((lang) => (
              <li key={lang} role="option" aria-selected={locale === lang}>
                <button
                  onClick={() => handleLanguageChange(lang)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-accent cursor-pointer ${
                    locale === lang ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <span>
                    {languageFlags[lang as keyof typeof languageFlags]}
                  </span>
                  {languageNames[lang as keyof typeof languageNames]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
