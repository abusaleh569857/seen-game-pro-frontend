'use client';

import HeroSection from '@/components/landing/HeroSection';
import CategoriesSection from '@/components/landing/CategoriesSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col font-sans overflow-x-hidden">
      <HeroSection />
      
      {/* Unified Gradient Background for all sections below Hero */}
      <div 
        className="w-full flex flex-col"
        style={{ background: 'linear-gradient(145deg, #08081A, #180A50)' }}
      >
        <CategoriesSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
        <Footer />
      </div>
    </main>
  );
}