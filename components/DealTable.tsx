'use client';

import type { Deal, Rank } from '@/lib/types';
import { RANK_TABLE } from '@/lib/types';

function formatYen(n: number): string {
  if (!n) return '-';
  return '¥' + n.toLocaleString('ja-JP');
}

export default function DealTable({ deals, rank }: { deals: Deal[]; rank: Rank }) {
  const share = RANK_TABLE.find((t) => t.rank === rank)?.share ?? 0.75;

  if (deals.length === 0) {
    return (
      <div className="card text-center text-gray-500">
        現在進行中の案件はありません
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="striped min-w-full text-sm">
        <thead>
          <tr className="bg-zerogra-navy text-white text-left">
            <th className="px-3 py-2 whitespace-nowrap">候補者名</th>
            <th className="px-3 py-2 whitespace-nowrap">応募企業</th>
            <th className="px-3 py-2 whitespace-nowrap">選考ステージ</th>
            <th className="px-3 py-2 whitespace-nowrap">ステータス</th>
            <th className="px-3 py-2 whitespace-nowrap text-right">決定報酬</th>
            <th className="px-3 py-2 whitespace-nowrap text-right">パートナー報酬</th>
            <th className="px-3 py-2 whitespace-nowrap">内定日</th>
            <th className="px-3 py-2 whitespace-nowrap">入社予定日</th>
            <th className="px-3 py-2 whitespace-nowrap">支払予定日</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((d, i) => {
            const partnerReward = Math.round(d.reward * share);
            return (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-3 py-2 whitespace-nowrap">{d.candidateName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{d.companyName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{d.stage}</td>
                <td className="px-3 py-2 whitespace-nowrap">{d.status}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  {formatYen(d.reward)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right font-medium text-zerogra-blue">
                  {formatYen(partnerReward)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{d.offerDate || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{d.joinDate || '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{d.partnerPayoutDate || '-'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
