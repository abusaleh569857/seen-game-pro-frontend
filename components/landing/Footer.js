import Link from 'next/link';
import { CircleDot } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full px-4 py-8 lg:px-10 lg:py-12 border-t border-white/5">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#6248FF] to-[#486CFF] shadow-sm">
            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-white/80">
              <CircleDot className="h-2 w-2 text-white" strokeWidth={3} />
            </div>
          </div>
          <span className="text-[14px] font-black uppercase text-white tracking-tight">
            Seen Game Pro
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[12px] font-medium text-white/50">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/admin" className="hover:text-[#A78BFA] transition-colors">Admin Panel</Link>
        </div>

        {/* Copyright */}
        <div className="text-[11px] font-medium text-white/30 text-center md:text-right flex items-center justify-center md:justify-end gap-1">
          <span>© 2026 Seen Game Pro.</span>
          <span className="hidden sm:inline">KWD Payments via Tap · SSL Secured</span>
        </div>
        
      </div>
    </footer>
  );
}
