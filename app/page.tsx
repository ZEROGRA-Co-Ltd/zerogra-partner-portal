'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const logoUrl = process.env.NEXT_PUBLIC_LOGO_URL || '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.partner) {
        setError(data.error || '未登録のメールアドレスです');
        setLoading(false);
        return;
      }
      sessionStorage.setItem('partnerName', data.partner.name);
      sessionStorage.setItem('partnerEmail', email);
      sessionStorage.setItem('portalData', JSON.stringify(data));
      router.push('/dashboard');
    } catch {
      setError('通信エラーが発生しました');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4">
      <div className="card w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="ZEROGRA" className="h-16 w-auto mb-4" />
          ) : (
            <div className="text-3xl font-bold text-zerogra-navy mb-4">ZEROGRA</div>
          )}
          <h1 className="text-xl font-semibold text-zerogra-navy text-center">
            RA Alliance Partner Portal
          </h1>
          <p className="text-sm text-gray-500 mt-2 text-center">
            メールアドレスでログインしてください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zerogra-blue"
              placeholder="you@example.com"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
