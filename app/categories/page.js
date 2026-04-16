'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Play,
  Flame,
  Gamepad2,
  Globe2,
  BookOpen,
  Music,
  Brush,
  Microscope,
  User,
  Building2,
  Pizza,
  Car,
  Monitor,
  Coffee,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useI18n } from '@/lib/i18n';
import { getLocalizedCategoryName, isRtlLanguage } from '@/lib/languages';
import { fetchCategories } from '@/store/slices/quizSlice';
import { useRouter } from 'next/navigation';

const ICON_MAP = {
  Sports: Gamepad2,
  'Sports & Nature': Gamepad2,
  History: BookOpen,
  Science: Microscope,
  Geography: Globe2,
  Culture: Coffee,
  Arts: Brush,
  Entertainment: Play,
  Nature: Flame,
  Technology: Monitor,
  Food: Pizza,
  Cars: Car,
  Business: Building2,
  Games: Gamepad2,
  Music: Music,
  General: User,
};

const COLOR_MAP = {
  Sports: 'border-t-[#16A34A]',
  History: 'border-t-[#D97706]',
  Science: 'border-t-[#0D9488]',
  Geography: 'border-t-[#4B7BEE]',
  Culture: 'border-t-[#A855F7]',
  Arts: 'border-t-[#EC4899]',
  Entertainment: 'border-t-[#EF4444]',
  Nature: 'border-t-[#10B981]',
  Technology: 'border-t-[#3B82F6]',
  Food: 'border-t-[#F59E0B]',
  Cars: 'border-t-[#EF4444]',
  Business: 'border-t-[#8B5CF6]',
  Games: 'border-t-[#10B981]',
  Music: 'border-t-[#EC4899]',
  General: 'border-t-[#64748B]',
};

const FILTERS = [
  { id: 'all', key: 'all', icon: null },
  { id: 'popular', key: 'popular', icon: Flame },
  { id: 'sports', key: 'sports', icon: Gamepad2 },
  { id: 'knowledge', key: 'knowledge', icon: BookOpen },
  { id: 'culture', key: 'culture', icon: Brush },
  { id: 'business', key: 'business', icon: Building2 },
];

function CategoriesContent() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useI18n();
  const { categories, categoriesLoading, selectedLang } = useSelector((state) => state.quiz);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const isRTL = isRtlLanguage(selectedLang);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleStartQuiz = (categoryId) => {
    router.push(`/play/${categoryId}?lang=${selectedLang}`);
  };

  const filteredCategories = categories.filter((cat) => {
    const localizedName = getLocalizedCategoryName(cat, selectedLang).toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      localizedName.includes(query) ||
      cat.name_en?.toLowerCase().includes(query) ||
      cat.name_ar?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <PageHeader pageName={t('categoriesPage.page_title')} />

      <div className={`max-w-[1440px] mx-auto px-4 lg:px-8 mt-6 ${isRTL ? 'text-right' : ''}`}>
        <div className="mb-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{t('categoriesPage.title')}</h2>
            <p className="text-[13px] text-gray-400 font-medium">{t('categoriesPage.subtitle')}</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
          <input
            type="text"
            placeholder={t('categoriesPage.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-3.5 rounded-2xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition shadow-sm text-[15px] font-medium placeholder:text-gray-400 ${isRTL ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full whitespace-nowrap text-[13px] font-bold transition-all border ${
                activeFilter === filter.id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'
              }`}
            >
              {filter.icon ? (
                <filter.icon className={`w-3.5 h-3.5 ${activeFilter === filter.id ? 'text-white' : 'text-orange-500'}`} />
              ) : null}
              {t(`categoriesPage.${filter.key}`)}
            </button>
          ))}
        </div>

        {categoriesLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {filteredCategories.map((category) => {
              const IconComp = ICON_MAP[category.name_en] || Gamepad2;
              const borderColor = COLOR_MAP[category.name_en] || 'border-t-gray-300';

              return (
                <button
                  key={category.id}
                  onClick={() => handleStartQuiz(category.id)}
                  className={`group relative bg-white rounded-3xl p-6 border-t-[3px] ${borderColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <IconComp className="w-7 h-7 text-gray-700" />
                  </div>
                  <h3 className="text-[15px] font-black text-gray-900 mb-1">{getLocalizedCategoryName(category, selectedLang)}</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{t('categoriesPage.questions')}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <ProtectedRoute>
      <CategoriesContent />
    </ProtectedRoute>
  );
}
