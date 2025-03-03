export const tagColors = {
  MentalHealth: 'bg-[#1E40AF]/20 text-blue-400 border border-blue-500/30',
  Wellness: 'bg-[#166534]/20 text-green-400 border border-green-500/30',
  Nutrition: 'bg-[#9A3412]/20 text-orange-400 border border-orange-500/30',
  Fitness: 'bg-[#6B21A8]/20 text-purple-400 border border-purple-500/30'
};

type TagProps = {
  tag: keyof typeof tagColors;
};

export default function Tag({ tag }: TagProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColors[tag]}`}>
      #{tag}
    </span>
  );
}
