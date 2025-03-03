'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
  ChartPieIcon, 
  BoltIcon, 
  HeartIcon, 
  SparklesIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { ForwardRefExoticComponent, SVGProps, RefAttributes } from 'react';
import { Section, VALID_SECTIONS } from '@/lib/utils/sections';
import { sectionConfig } from '@/lib/utils/section-config';

type IconType = ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & { title?: string; titleId?: string; } & RefAttributes<SVGSVGElement>>;

// Icons are client-only, so we keep them separate
const sectionIcons: Record<Section, IconType> = {
  nutrition: ChartPieIcon,
  strength: BoltIcon,
  cardio: HeartIcon,
  yoga: SparklesIcon,
  mental: BeakerIcon,
};

interface SectionNavProps {
  activeSection: Section;
}

export default function SectionNav({ activeSection }: SectionNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSectionChange = (section: Section) => {
    router.push(`${pathname}?section=${section}`);
  };

  return (
    <div className="mb-8">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {VALID_SECTIONS.map((sectionId) => {
          const section = sectionConfig[sectionId];
          const Icon = sectionIcons[sectionId];
          const isActive = activeSection === sectionId;
          return (
            <button
              key={sectionId}
              onClick={() => handleSectionChange(sectionId)}
              className={`
                flex items-center px-4 py-2 rounded-lg transition-all
                ${isActive ? 'bg-[#1E293B] text-white' : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'}
              `}
              style={{
                borderBottom: isActive ? `2px solid ${section.color}` : 'none'
              }}
            >
              <Icon className="w-5 h-5 mr-2" style={{ color: section.color }} />
              <span className="whitespace-nowrap font-medium">{section.name}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {VALID_SECTIONS.map((sectionId) => (
          activeSection === sectionId && (
            <p key={sectionId} className="text-[#94A3B8] text-sm">
              {sectionConfig[sectionId].description}
            </p>
          )
        ))}
      </div>
    </div>
  );
}
