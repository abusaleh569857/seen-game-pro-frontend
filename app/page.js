"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/Navbar";
import { fetchCategories, setSelectedLang } from "@/store/slices/quizSlice";

const LANGS = [
  { code: "ar", label: "Arabic" },
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "ur", label: "Urdu" },
];

export default function HomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories, categoriesLoading, categoriesError, selectedLang } = useSelector(
    (state) => state.quiz,
  );
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handlePlay = (categoryId) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    router.push(`/play/${categoryId}?lang=${selectedLang}`);
  };

  const getCatName = (category) => {
    const names = {
      ar: category.name_ar,
      en: category.name_en,
      fr: category.name_fr,
      ur: category.name_ur,
    };

    return names[selectedLang] || category.name_en;
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <section className="mb-8 text-center">
          <h1 className="mb-2 bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-4xl font-black text-transparent">
            Seen Game Pro
          </h1>
          <p className="mb-6 text-gray-400">
            Choose a category and start playing
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {LANGS.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => dispatch(setSelectedLang(language.code))}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  selectedLang === language.code
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {language.label}
              </button>
            ))}
          </div>
        </section>

        {categoriesLoading ? (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl bg-gray-800 p-4 animate-pulse"
              />
            ))}
          </div>
        ) : categoriesError ? (
          <div className="rounded-2xl border border-red-800 bg-red-950/40 p-6 text-center">
            <p className="text-lg font-semibold text-red-300">Categories could not be loaded.</p>
            <p className="mt-2 text-sm text-gray-300">
              Make sure the backend API is running at http://localhost:5000 and then refresh the page.
            </p>
            <p className="mt-2 text-xs text-gray-500">Error: {categoriesError}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-center text-gray-400">
            No categories available yet.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handlePlay(category.id)}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900 p-4 transition-all active:scale-95 hover:border-purple-500 hover:bg-gray-800"
              >
                <span className="text-3xl transition-transform group-hover:scale-110">
                  {category.icon || "?"}
                </span>
                <span className="text-center text-xs font-medium text-gray-300 transition group-hover:text-white">
                  {getCatName(category)}
                </span>
              </button>
            ))}
          </div>
        )}
      </main>
    </>
  );
}