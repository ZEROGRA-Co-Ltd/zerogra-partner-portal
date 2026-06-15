'use client';

import type { Rank } from '@/lib/types';
import { RANK_TABLE } from '@/lib/types';

function formatYen(n: number): string {
  return '¥' + n.toLocaleString('ja-JP');
}

const RANK_EMOJI: Record<Rank, string> = {
  STANDARD: '🥉',
  SILVER: '🥈',
  GOLD: '🥇',
  PLATINUM: '💎',
};

const RANK_TEXT_GRADIENT: Record<Rank, string> = {
  STANDARD: 'bg-gradient-to-r from-gray-300 to-gray-500',
  SILVER: 'bg-gradient-to-r from-gray-200 to-gray-400',
  GOLD: 'bg-gradient-to-r from-[#f1c40f] to-[#f39c12]',
  PLATINUM: 'bg-gradient-to-r from-[#00c6ff] to-[#0072ff]',
};

export default function SummaryCards({
  rank,
  periodSales,
  nextRank,
  neededAmount,
}: {
  rank: Rank;
  periodSales: number;
  nextRank: Rank | null;
  neededAmount: number;
}) {
  const currentTier = RANK_TABLE.find((t) => t.rank === rank);
  const nextTier = nextRank ? RANK_TABLE.find((t) => t.rank === nextRank) : null;

  let progress = 0;
  if (nextTier && currentTier) {
    const span = nextTier.threshold - currentTier.threshold;
    progress = span > 0
      ? Math.max(0, Math.min(100, ((periodSales - currentTier.threshold) / span) * 100))
      : 0;
  } else {
    progress = 100;
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0a0f1e] to-[#1a2340] text-white shadow-lg p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-0">
        <div className="flex-1 flex flex-col items-start md:pr-8">
          <span className="text-xs uppercase tracking-widest text-white/50 mb-3">
            現在のランク
          </span>
          <div className="flex items-center gap-4">
            <span className="text-6xl leading-none" aria-hidden>
              {RANK_EMOJI[rank]}
            </span>
            <span
              className={`text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text ${RANK_TEXT_GRADIENT[rank]}`}
            >
              {rank}
            </span>
          </div>
        </div>

        <div className="hidden md:block w-px bg-white/10" />

        <div className="flex-1 flex flex-col items-start md:px-8">
          <span className="text-xs uppercase tracking-widest text-white/50 mb-3">
            評価期間内売上（180日）
          </span>
          <span className="text-3xl md:text-4xl font-bold text-white">
            {formatYen(periodSales)}
          </span>
          <div className="w-full mt-4">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00c6ff] to-[#0072ff] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-[11px] text-white/50 mt-1">
              {nextTier ? `次のランクまで ${Math.round(progress)}%` : '最高ランク到達'}
            </div>
          </div>
        </div>

        <div className="hidden md:block w-px bg-white/10" />

        <div className="flex-1 flex flex-col items-start md:pl-8">
          <span className="text-xs uppercase tracking-widest text-white/50 mb-3">
            次のランクまで
          </span>
          {nextRank ? (
            <>
              <span className="text-3xl md:text-4xl font-bold text-[#00c6ff]">
                {formatYen(neededAmount)}
              </span>
              <span className="mt-2 text-sm text-white/70">→ {nextRank}</span>
            </>
          ) : (
            <span className="text-2xl md:text-3xl font-bold text-amber-300">
              🏆 最高ランク達成
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
