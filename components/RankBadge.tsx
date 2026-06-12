'use client';

import type { Rank } from '@/lib/types';

const RANK_STYLES: Record<Rank, { bg: string; label: string }> = {
  STANDARD: {
    bg: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
    label: 'STANDARD',
  },
  SILVER: {
    bg: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white',
    label: 'SILVER',
  },
  GOLD: {
    bg: 'bg-gradient-to-r from-[#f1c40f] to-[#f39c12] text-white',
    label: 'GOLD',
  },
  PLATINUM: {
    bg: 'bg-gradient-to-r from-[#00c6ff] to-[#0072ff] text-white',
    label: 'PLATINUM',
  },
};

export default function RankBadge({ rank }: { rank: Rank }) {
  const style = RANK_STYLES[rank];
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm ${style.bg}`}
    >
      {style.label}
    </span>
  );
}
