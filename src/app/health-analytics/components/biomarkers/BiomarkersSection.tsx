'use client';

import React from 'react';
import { BiomarkerData } from '@/lib/types/health';
import BiomarkerStatusBoard from './BiomarkerStatusBoard';
import BiomarkerTrendsChart from './BiomarkerTrendsChart';

interface BiomarkersSectionProps {
  data: BiomarkerData[];
}

const BiomarkersSection: React.FC<BiomarkersSectionProps> = ({ data }) => {
  // Get latest biomarker data
  const latestData = data[0];

  return (
    <div className="space-y-6">
      <BiomarkerStatusBoard data={latestData} />
      <BiomarkerTrendsChart data={data} />
    </div>
  );
};

export default BiomarkersSection;
