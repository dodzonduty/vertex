import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { PathToMastery } from '../components/PathToMastery';
import { Opportunities } from '../components/Opportunities';
import { CallToAction } from '../components/CallToAction';

export const LandingPage: React.FC = () => {
  return (
    <>
      <HeroSection />
      <PathToMastery />
      <Opportunities />
      <CallToAction />
    </>
  );
};
