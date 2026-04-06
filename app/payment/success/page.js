'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const [qeem, setQeem] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setQeem(params.get('qeem') || 0);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-green-700 bg-gray-900 p-10 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="mb-2 text-2xl font-bold text-green-400">Payment Successful!</h1>
        <p className="mb-6 text-gray-400">
          You received <span className="text-xl font-bold text-yellow-400">{qeem} 💎 Qeem</span>
        </p>
        <Link
          href="/"
          className="block w-full rounded-xl bg-purple-600 py-3 font-bold transition hover:bg-purple-500"
        >
          Start Playing
        </Link>
      </div>
    </div>
  );
}