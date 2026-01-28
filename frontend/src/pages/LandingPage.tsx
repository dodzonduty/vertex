import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { PathToMastery } from '../components/PathToMastery';
import { LiveEvents } from '../components/LiveEvents';
import { CallToAction } from '../components/CallToAction';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <PathToMastery />
        <LiveEvents />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};
