import Link from 'next/link';
import { CircleDot } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useSelector } from 'react-redux';
import { isRtlLanguage } from '@/lib/languages';

export default function Footer() {
  const { t } = useI18n();
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const isRTL = isRtlLanguage(selectedLang);

  return (
    <footer className="w-full px-4 py-8 lg:px-10 lg:py-12 border-t border-white/5">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-linear-to-br from-[#6248FF] to-[#486CFF] shadow-sm">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/80">
              <CircleDot className="h-2 w-2 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[14px] font-black uppercase text-white tracking-tight">{t('nav.brand_name')}</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[12px] font-medium text-white/50">
          <Link href="/terms" className="hover:text-white transition-colors">{t('landing.footer_terms')}</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">{t('landing.footer_privacy')}</Link>
          <Link href="/contact" className="hover:text-white transition-colors">{t('landing.footer_contact')}</Link>
          <Link href="/admin" className="hover:text-[#A78BFA] transition-colors">{t('landing.footer_admin')}</Link>
        </div>

        <div className={`text-[11px] font-medium text-white/30 text-center flex items-center justify-center gap-1 ${isRTL ? 'md:text-left md:justify-start' : 'md:text-right md:justify-end'}`}>
          <span>{t('landing.footer_copy')}</span>
          <span className="hidden sm:inline">{t('landing.footer_secure')}</span>
        </div>
      </div>
    </footer>
  );
}
