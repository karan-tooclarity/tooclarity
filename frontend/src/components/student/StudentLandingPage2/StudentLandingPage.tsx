"use client";
import StreamsSection from './InstitutesPageStreams';
import FAQSection from './FAQSection';
import Footer from './Footer';
import Header from './HeaderSection';
import FeaturesSection from './FeatureSection';
import HeroSection from './HeroSection';
import CTASection from './CTASection';
import React from 'react';

const TooClarity = () => {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* Header - Standalone for fixed positioning */}
      <Header />
      
      {/* Main Content - Responsive padding to avoid header overlap, constrained width */}
     <main className="pt-12 sm:pt-20 md:pt-20 lg:pt-24 min-h-screen w-full max-w-screen-3xl mx-auto px-2 sm:px-8 md:px-6 lg:px-8 xl:px-0 overflow-x-hidden">
        <HeroSection />
        
        {/* Streams Section */}
        <StreamsSection />

        <FeaturesSection />
        <FAQSection />
        
        {/* Final CTA */}
        <CTASection />
      </main>

      {/* Footer - Full-width, no overlap issues */}
      <Footer />
    </div>
  );
};

export default TooClarity;