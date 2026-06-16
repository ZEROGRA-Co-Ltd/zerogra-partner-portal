'use client';

import { useMemo, useState } from 'react';
import type { Deal, Rank } from '@/lib/types';
import { RANK_TABLE } from '@/lib/types';

function formatYen(n: number): string {
  if (!n) return '-';
  return '¥' + n.toLocaleString('ja-JP');
}

type SortKey =
  | 'candidateName'
  | 'companyName'
  | 'stage'
  | 'status'
  | 'reward'
  | 'partnerReward'
  | 'offerDate'
  | 'joinDate'
  | 'partnerPayoutDate';

type SortDirection = 'asc' | 'desc' | null;
type SortType = 'string' | 'number';

const COLUMNS: {
  key: SortKey;
  label: string;
  type: SortType;
  align?: 'right';
}[] = [
  { key: 'candidateName', label: '候補者名', type: 'string' },
  { key: 'companyName', label: '応募企業', type: 'string' },
  { key: 'stage', label: '選考ステージ', type: 'string' },
  { key: 'status', label: 'ステータス', type: 'string' },
  { key: 'reward', label: '決定報酬', type: 'number', align: 'right' },
  { key: 'partnerReward', label: 'パートナー報酬', type: 'number', align: 'right' },
  { key: 'offerDate', label: '内定日', type: 'string' },
  { key: 'joinDate', label: '入社予定日', type: 'string' },
  { key: 'partnerPayoutDate', label: '支払予定日', type: 'string' },
];

const ENDED_STAGE = '選考終了';

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === 'asc') return <span aria-hidden>↑</span>;
  if (direction === 'desc') return <span aria-hidden>↓</span>;
  return <span aria-hidden className="text-white/40">↑↓</span>;
}

export default function DealTable({ deals, rank }: { deals: Deal[]; rank: Rank }) {
  const share = RANK_TABLE.find((t) => t.rank === rank)?.share ?? 0.75;

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const enriched = useMemo(
    () =>
      deals.map((d) => ({
        ...d,
        partnerReward: Math.round(d.reward * share),
      })),
    [deals, share]
  );

  const sorted = useMemo(() => {
    if (!sortKey || !sortDirection) return enriched;
    const col = COLUMNS.find((c) => c.key === sortKey);
    const type = col?.type ?? 'string';
    const dir = sortDirection === 'asc' ? 1 : -1;
    return [...enriched].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (type === 'number') {
        return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
      }
      return String(av).localeCompare(String(bv), 'ja') * dir;
    });
  }, [enriched, sortKey, sortDirection]);

  function handleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection('asc');
      return;
    }
    if (sortDirection === 'asc') {
      setSortDirection('desc');
      return;
    }
    setSortKey(null);
    setSortDirection(null);
  }

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
            {COLUMNS.map((c) => {
              const active = sortKey === c.key;
              const direction = active ? sortDirection : null;
              return (
                <th
                  key={c.key}
                  scope="col"
                  onClick={() => handleSort(c.key)}
                  className={`px-3 py-2 whitespace-nowrap cursor-pointer select-none transition-colors ${
                    c.align === 'right' ? 'text-right' : ''
                  } ${active ? 'bg-zerogra-blue text-white' : 'hover:bg-white/10'}`}
                >
                  <span className={`inline-flex items-center gap-1 ${c.align === 'right' ? 'justify-end w-full' : ''}`}>
                    <span>{c.label}</span>
                    <SortIcon direction={direction} />
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((d, i) => {
            const ended = d.stage === ENDED_STAGE;
            return (
              <tr
                key={i}
                className={`border-b border-gray-100 ${
                  ended ? 'opacity-40 hover:!bg-gray-100' : ''
                }`}
              >
                <td className="px-3 py-2 whitespace-nowrap">{d.candidateName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{d.companyName}</td>
                <td
                  className={`px-3 py-2 whitespace-nowrap ${
                    ended ? 'text-gray-500' : ''
                  }`}
                >
                  {d.stage}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{d.status}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  {formatYen(d.reward)}
                </td>
                <td
                  className={`px-3 py-2 whitespace-nowrap text-right font-medium ${
                    ended ? 'text-gray-500' : 'text-zerogra-blue'
                  }`}
                >
                  {formatYen(d.partnerReward)}
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
