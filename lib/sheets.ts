import { google, sheets_v4 } from 'googleapis';
import type { Deal, Job, Partner, Rank } from './types';
import { RANK_TABLE } from './types';

export const SPREADSHEET_ID_JOBS = '1V4AxgmQon75Q9CBdzUzCS3aD43SFnDvnpal4cYT-Ecg';

let cachedClient: sheets_v4.Sheets | null = null;

export function getSheetsClient(): sheets_v4.Sheets {
  if (cachedClient) return cachedClient;

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error('Google service account credentials are not configured');
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  cachedClient = google.sheets({ version: 'v4', auth });
  return cachedClient;
}

export async function getSheetValues(
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
  });
  return (res.data.values as string[][]) || [];
}

export function parseNumber(v: unknown): number {
  if (v == null || v === '') return 0;
  if (typeof v === 'number') return v;
  const s = String(v).replace(/[^0-9.\-]/g, '');
  const n = Number(s);
  return isNaN(n) ? 0 : n;
}

export function parseDate(v: unknown): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  const m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
  if (m) {
    const dt = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    if (!isNaN(dt.getTime())) return dt;
  }
  return null;
}

export function findPartnerByEmail(
  rows: string[][],
  email: string
): Partner | null {
  const target = email.trim().toLowerCase();
  if (!target) return null;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const emailsCell = row[8] || '';
    const emails = emailsCell
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (emails.includes(target)) {
      return {
        registeredAt: row[0] || '',
        name: row[1] || '',
        emails,
      };
    }
  }
  return null;
}

export function parseDeals(rows: string[][], partnerName: string): Deal[] {
  const deals: Deal[] = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const referral = (row[5] || '').trim();
    const owner = (row[6] || '').trim();
    if (referral !== '提携Agent') continue;
    if (owner !== partnerName) continue;

    const paymentDate = row[19] || '';
    let partnerPayoutDate = '';
    const pd = parseDate(paymentDate);
    if (pd) {
      const payout = new Date(pd);
      payout.setDate(payout.getDate() + 10);
      partnerPayoutDate = formatDate(payout);
    }

    deals.push({
      candidateName: row[2] || '',
      companyName: row[3] || '',
      referralType: referral,
      partnerName: owner,
      stage: row[8] || '',
      status: row[11] || '',
      reward: parseNumber(row[14]),
      raSales: parseNumber(row[15]),
      offerDate: row[16] || '',
      acceptedDate: row[17] || '',
      joinDate: row[18] || '',
      paymentDate,
      partnerPayoutDate,
    });
  }
  return deals;
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}/${m}/${day}`;
}

export function calculateRank(
  deals: Deal[],
  registeredAt: string
): { rank: Rank; periodSales: number; nextRank: Rank | null; neededAmount: number } {
  const regDate = parseDate(registeredAt);
  const start = regDate ? regDate.getTime() : 0;
  const end = start ? start + 180 * 24 * 60 * 60 * 1000 : Infinity;

  let periodSales = 0;
  for (const d of deals) {
    if (d.status !== '内定承諾 (入社日確定)') continue;
    const acc = parseDate(d.acceptedDate) || parseDate(d.offerDate);
    const t = acc ? acc.getTime() : 0;
    if (!start || (t >= start && t <= end)) {
      periodSales += d.reward;
    }
  }

  let current: Rank = 'STANDARD';
  for (const tier of RANK_TABLE) {
    if (periodSales >= tier.threshold) current = tier.rank;
  }
  const idx = RANK_TABLE.findIndex((t) => t.rank === current);
  const next = RANK_TABLE[idx + 1] || null;
  const neededAmount = next ? Math.max(0, next.threshold - periodSales) : 0;

  return {
    rank: current,
    periodSales,
    nextRank: next ? next.rank : null,
    neededAmount,
  };
}

export function parseJobs(rows: string[][]): Job[] {
  const jobs: Job[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i] || [];
    if (!row[2]) continue;
    const recommendCell = row[0] || '';
    const stars = (String(recommendCell).match(/★/g) || []).length;
    jobs.push({
      recommend: stars || parseNumber(recommendCell),
      hireRecord: row[1] || '',
      company: row[2] || '',
      jobUrl: row[3] || '',
      difficulty: row[4] || '',
      area: row[5] || '',
      industry: row[6] || '',
      position: row[7] || '',
      requirement: row[8] || '',
      memo: row[9] || '',
    });
  }
  return jobs;
}

export type { Deal, Job, Partner, Rank };
