'use client';

import RankBadge from './RankBadge';
import type { Rank } from '@/lib/types';

function formatYen(n: number): string {
  return '¥' + n.toLocaleString('ja-JP');
}

const RANK_EMOJI: Record<Rank, string> = {
  STANDARD: '◯',
  SILVER: '◆',
  GOLD: '★',
  PLATINUM: '◈',
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card flex flex-col items-start">
        <div className="text-sm text-gray-500 mb-2">現在のランク</div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{RANK_EMOJI[rank]}</span>
          <RankBadge rank={rank} />
        </div>
      </div>

      <div className="card flex flex-col items-start">
        <div className="text-sm text-gray-500 mb-2">評価期間内売上（180日）</div>
        <div className="text-2xl font-bold text-zerogra-navy">
          {formatYen(periodSales)}
        </div>
      </div>

      <div className="card flex flex-col items-start">
        <div className="text-sm text-gray-500 mb-2">次のランクまで</div>
        {nextRank ? (
          <div>
            <div className="text-2xl font-bold text-zerogra-blue">
              {formatYen(neededAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">→ {nextRank}</div>
          </div>
        ) : (
          <div className="text-lg font-bold text-amber-600">最高ランク達成！</div>
        )}
      </div>
    </div>
  );
}
