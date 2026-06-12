import { NextResponse } from 'next/server';
import {
  getSheetValues,
  findPartnerByEmail,
  parseDeals,
  calculateRank,
} from '@/lib/sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'メールアドレスを入力してください' }, { status: 400 });
    }

    const mainId = process.env.SPREADSHEET_ID_MAIN;
    if (!mainId) {
      return NextResponse.json({ error: 'サーバー設定エラー' }, { status: 500 });
    }

    const partnerRows = await getSheetValues(mainId, 'm_partner!A:Z');
    const partner = findPartnerByEmail(partnerRows, email);
    if (!partner) {
      return NextResponse.json({ error: '未登録のメールアドレスです' }, { status: 404 });
    }

    const dealRows = await getSheetValues(mainId, '選考案件リスト!A:Z');
    const deals = parseDeals(dealRows, partner.name);
    const { rank, periodSales, nextRank, neededAmount } = calculateRank(
      deals,
      partner.registeredAt
    );

    return NextResponse.json({
      partner,
      deals,
      totalSales: periodSales,
      rank,
      nextRank,
      neededAmount,
    });
  } catch (err) {
    console.error('[auth] error', err);
    return NextResponse.json(
      { error: 'データ取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
