import { NextResponse } from 'next/server';
import { getSheetValues, parseJobs, SPREADSHEET_ID_JOBS } from '@/lib/sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  try {
    const rows = await getSheetValues(SPREADSHEET_ID_JOBS, '求人リスト!A:Z');
    const jobs = parseJobs(rows);
    return NextResponse.json({ jobs });
  } catch (err) {
    console.error('[jobs] error', err);
    return NextResponse.json(
      { error: '求人データ取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
