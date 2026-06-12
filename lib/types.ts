export type Partner = {
  registeredAt: string;
  name: string;
  emails: string[];
};

export type Deal = {
  candidateName: string;
  companyName: string;
  referralType: string;
  partnerName: string;
  stage: string;
  status: string;
  reward: number;
  raSales: number;
  offerDate: string;
  acceptedDate: string;
  joinDate: string;
  paymentDate: string;
  partnerPayoutDate: string;
};

export type Rank = 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';

export const RANK_TABLE: { rank: Rank; threshold: number; share: number; emoji: string }[] = [
  { rank: 'STANDARD', threshold: 0, share: 0.75, emoji: 'STD' },
  { rank: 'SILVER', threshold: 5_000_000, share: 0.80, emoji: 'SLV' },
  { rank: 'GOLD', threshold: 10_000_000, share: 0.85, emoji: 'GLD' },
  { rank: 'PLATINUM', threshold: 20_000_000, share: 0.90, emoji: 'PLT' },
];

export type Job = {
  recommend: number;
  hireRecord: string;
  company: string;
  jobUrl: string;
  difficulty: string;
  area: string;
  industry: string;
  position: string;
  requirement: string;
  memo: string;
};
