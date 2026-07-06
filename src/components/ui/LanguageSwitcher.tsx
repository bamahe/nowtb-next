// =============================================================================
// LanguageSwitcher — Google Translate dropdown for multi-language support
// "use client" because it loads the Google Translate script dynamically
// =============================================================================

"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; includedLanguages: string; layout: unknown; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
    googleTranslateElementInit: () => void;
  }
}

export default function LanguageSwitcher() {
  useEffect(() => {
    // Only load once
    if (document.getElementById("google-translate-script")) return;

    // Define the callback Google Translate expects
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,fr,de,it,pt,zh-CN,ja,ko,ru,vi",
          layout: 0, // SIMPLE layout
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // Load the script
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      className="[&_.goog-te-gadget]:font-body [&_.goog-te-gadget]:text-[10px]
                 [&_.goog-te-gadget-simple]:border [&_.goog-te-gadget-simple]:border-white/20
                 [&_.goog-te-gadget-simple]:bg-transparent [&_.goog-te-gadget-simple]:px-2
                 [&_.goog-te-gadget-simple]:py-1
                 [&_a]:text-inherit [&_a]:no-underline
                 [&_span]:text-inherit
                 [&_.goog-te-gadget>span]:hidden
                 [&_img]:hidden"
    />
  );
}
