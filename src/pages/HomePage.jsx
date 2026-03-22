import React from 'react';
import Hero from '../components/Layout/Hero';
import ProgramsSection from '../components/Programs/ProgramsSection';
import FeaturedCoaches from '../components/Trainers/FeaturedCoaches';
import HowItWorks from '../components/Sections/HowItWorks';
import CTASection from '../components/Sections/CTASection';

const HomePage = ({ setPage, setSelectedTrainer, setGoalFilter }) => (
  <>
    <Hero setPage={setPage} setGoalFilter={setGoalFilter} />
    <ProgramsSection setPage={setPage} setGoalFilter={setGoalFilter} />
    <FeaturedCoaches setPage={setPage} setSelectedTrainer={setSelectedTrainer} />
    <HowItWorks />
    <CTASection setPage={setPage} />
  </>
);

export default HomePage;
