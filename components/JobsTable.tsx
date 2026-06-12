'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Job } from '@/lib/types';

const ENTRY_URL = 'https://app.agenthub.jp/alliance/zerogra/jobs';

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean))).sort();
}

function Stars({ n }: { n: number }) {
  if (!n) return <span className="text-gray-300">-</span>;
  return <span className="text-amber-500">{'★'.repeat(n)}</span>;
}

export default function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [area, setArea] = useState('');
  const [industry, setIndustry] = useState('');
  const [position, setPosition] = useState('');
  const [requirement, setRequirement] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [recommendedOnly, setRecommendedOnly] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setJobs(data.jobs || []);
      } catch (e) {
        setError('求人データを取得できませんでした');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filters = useMemo(
    () => ({
      areas: uniq(jobs.map((j) => j.area)),
      industries: uniq(jobs.map((j) => j.industry)),
      positions: uniq(jobs.map((j) => j.position)),
      requirements: uniq(jobs.map((j) => j.requirement)),
      difficulties: uniq(jobs.map((j) => j.difficulty)),
    }),
    [jobs]
  );

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (area && j.area !== area) return false;
      if (industry && j.industry !== industry) return false;
      if (position && j.position !== position) return false;
      if (requirement && j.requirement !== requirement) return false;
      if (difficulty && j.difficulty !== difficulty) return false;
      if (recommendedOnly && j.recommend <= 0) return false;
      return true;
    });
  }, [jobs, area, industry, position, requirement, difficulty, recommendedOnly]);

  if (loading) return <div className="card text-gray-500">読み込み中...</div>;
  if (error) return <div className="card text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="card flex flex-wrap gap-3 items-end">
        <Select label="エリア" value={area} onChange={setArea} options={filters.areas} />
        <Select
          label="業界"
          value={industry}
          onChange={setIndustry}
          options={filters.industries}
        />
        <Select
          label="職種"
          value={position}
          onChange={setPosition}
          options={filters.positions}
        />
        <Select
          label="応募要件"
          value={requirement}
          onChange={setRequirement}
          options={filters.requirements}
        />
        <Select
          label="選考難易度"
          value={difficulty}
          onChange={setDifficulty}
          options={filters.difficulties}
        />
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 ml-2">
          <input
            type="checkbox"
            checked={recommendedOnly}
            onChange={(e) => setRecommendedOnly(e.target.checked)}
            className="w-4 h-4"
          />
          オススメのみ
        </label>
      </div>

      <div className="card overflow-x-auto">
        <table className="striped min-w-full text-sm">
          <thead>
            <tr className="bg-zerogra-navy text-white text-left">
              <th className="px-3 py-2 whitespace-nowrap">オススメ</th>
              <th className="px-3 py-2 whitespace-nowrap">社名</th>
              <th className="px-3 py-2 whitespace-nowrap">業界</th>
              <th className="px-3 py-2 whitespace-nowrap">職種</th>
              <th className="px-3 py-2 whitespace-nowrap">エリア</th>
              <th className="px-3 py-2 whitespace-nowrap">難易度</th>
              <th className="px-3 py-2 whitespace-nowrap">内定実績</th>
              <th className="px-3 py-2 whitespace-nowrap">応募要件</th>
              <th className="px-3 py-2 whitespace-nowrap">求人票</th>
              <th className="px-3 py-2 whitespace-nowrap">エントリー</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-4 text-center text-gray-500">
                  該当する求人がありません
                </td>
              </tr>
            ) : (
              filtered.map((j, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Stars n={j.recommend} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{j.company}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{j.industry}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{j.position}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{j.area}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{j.difficulty}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{j.hireRecord || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{j.requirement}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {j.jobUrl ? (
                      <a
                        href={j.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs px-3 py-1"
                      >
                        求人票を見る
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <a
                      href={ENTRY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs px-3 py-1"
                    >
                      エントリーする
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-zerogra-blue"
      >
        <option value="">すべて</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
