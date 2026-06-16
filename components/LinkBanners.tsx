'use client';

type Banner = {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  gradient: string;
};

const BANNERS: Banner[] = [
  {
    href: 'https://docs.google.com/spreadsheets/d/1V4AxgmQon75Q9CBdzUzCS3aD43SFnDvnpal4cYT-Ecg/edit?gid=43064230#gid=43064230',
    icon: '🔥',
    title: 'HOT求人リスト',
    subtitle: '内定実績・難易度つきの厳選求人',
    gradient: 'bg-gradient-to-br from-[#ff6b35] to-[#f7c948]',
  },
  {
    href: 'https://app.agenthub.jp/alliance/zerogra/jobs',
    icon: '🗂️',
    title: '求人データベース',
    subtitle: '全求人をagenthubで検索・エントリー',
    gradient: 'bg-gradient-to-br from-[#0072ff] to-[#00c6ff]',
  },
  {
    href: 'https://docs.google.com/document/d/1_GWd2llVMO-GOi5eqIFDW48cL6szTbh-/edit?usp=sharing&ouid=107220582253354436809&rtpof=true&sd=true',
    icon: '📄',
    title: '利用規約',
    subtitle: 'RAアライアンス利用規約を確認',
    gradient: 'bg-gradient-to-br from-[#4a5568] to-[#2d3748]',
  },
  {
    href: 'https://docs.google.com/spreadsheets/d/1V4AxgmQon75Q9CBdzUzCS3aD43SFnDvnpal4cYT-Ecg/edit?gid=160715395#gid=160715395',
    icon: '👥',
    title: 'RA担当連絡先',
    subtitle: '担当RAの電話・メール・Slackを確認',
    gradient: 'bg-gradient-to-br from-[#11998e] to-[#38ef7d]',
  },
];

export default function LinkBanners() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {BANNERS.map((b) => (
        <a
          key={b.title}
          href={b.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group h-28 rounded-xl ${b.gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 px-5 py-4 flex items-center gap-4`}
        >
          <span className="text-3xl leading-none" aria-hidden>
            {b.icon}
          </span>
          <span className="flex flex-col">
            <span className="text-[18px] font-bold leading-tight">{b.title}</span>
            <span className="text-xs opacity-80 mt-1">{b.subtitle}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
