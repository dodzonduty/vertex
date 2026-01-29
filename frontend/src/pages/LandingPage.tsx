import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { PathToMastery } from '../components/PathToMastery';
import { Opportunities } from '../components/Opportunities';
import { CallToAction } from '../components/CallToAction';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PathToMastery />
        <Opportunities />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};
