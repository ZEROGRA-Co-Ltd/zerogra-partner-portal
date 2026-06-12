'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RankBadge from '@/components/RankBadge';
import SummaryCards from '@/components/SummaryCards';
import DealTable from '@/components/DealTable';
import JobsTable from '@/components/JobsTable';
import type { Deal, Partner, Rank } from '@/lib/types';

type PortalData = {
  partner: Partner;
  deals: Deal[];
  totalSales: number;
  rank: Rank;
  nextRank: Rank | null;
  neededAmount: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<PortalData | null>(null);
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || '';

  useEffect(() => {
    const partnerName = sessionStorage.getItem('partnerName');
    const raw = sessionStorage.getItem('portalData');
    if (!partnerName || !raw) {
      router.replace('/');
      return;
    }
    try {
      setData(JSON.parse(raw));
    } catch {
      router.replace('/');
    }
  }, [router]);

  function logout() {
    sessionStorage.clear();
    router.replace('/');
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        読み込み中...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="ZEROGRA" className="h-8 w-auto" />
            ) : (
              <span className="font-bold text-zerogra-navy">ZEROGRA</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zerogra-navy hidden sm:inline">
              {data.partner.name}
            </span>
            <RankBadge rank={data.rank} />
          </div>
          <button onClick={logout} className="btn-secondary text-sm py-1 px-3">
            ログアウト
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <section>
          <SummaryCards
            rank={data.rank}
            periodSales={data.totalSales}
            nextRank={data.nextRank}
            neededAmount={data.neededAmount}
          />
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 text-zerogra-navy">選考案件リスト</h2>
          <DealTable deals={data.deals} rank={data.rank} />
        </section>

        <section>
          <h2 className="text-lg font-bold mb-3 text-zerogra-navy">HOT求人リスト</h2>
          <JobsTable />
        </section>

        <footer className="text-center text-xs text-gray-400 pt-8 pb-4">
          © ZEROGRA RA Alliance
        </footer>
      </main>
    </div>
  );
}
