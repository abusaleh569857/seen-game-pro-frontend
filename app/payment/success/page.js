'use client';

import Link from 'next/link';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserBalance } from '@/store/slices/authSlice';

export default function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { user } = useSelector((state) => state.auth);

  const qeem = Number.parseInt(searchParams.get('qeem') || '0', 10);

  useEffect(() => {
    if (!user || !qeem) {
      return;
    }

    const nextBalance = Number(user.qeemBalance ?? user.qeem_balance ?? 0) + qeem;
    dispatch(updateUserBalance(nextBalance));
    Cookies.set(
      'user',
      JSON.stringify({
        ...user,
        qeemBalance: nextBalance,
        qeem_balance: nextBalance,
      }),
      { expires: 7 },
    );
  }, [dispatch, qeem, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-green-700 bg-gray-900 p-10 text-center">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="mb-2 text-2xl font-bold text-green-400">Payment Successful!</h1>
        <p className="mb-6 text-gray-400">
          You received <span className="text-xl font-bold text-yellow-400">{qeem} Qeem</span>
        </p>
        <Link
          href="/shop"
          className="block w-full rounded-xl bg-purple-600 py-3 font-bold transition hover:bg-purple-500"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
