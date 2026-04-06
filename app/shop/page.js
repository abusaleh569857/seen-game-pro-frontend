'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '@/components/Navbar';
import PackageCard from '@/components/PackageCard';
import ProtectedRoute from '@/components/ProtectedRoute';
import { clearCheckoutUrl } from '@/store/slices/shopSlice';

function ShopContent() {
  const dispatch = useDispatch();
  const { packages, error, checkoutUrl } = useSelector((state) => state.shop);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!checkoutUrl) {
      return;
    }

    window.location.href = checkoutUrl;
    dispatch(clearCheckoutUrl());
  }, [checkoutUrl, dispatch]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">?? Qeem Shop</h1>
          <p className="text-gray-400">Buy Qeem to use Jokers during quizzes</p>
          {user ? (
            <p className="mt-2 font-bold text-yellow-400">
              Your balance: {user.qeemBalance ?? user.qeem_balance ?? 0} ?? Qeem
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-900/50 px-4 py-3 text-center text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(packages).map(([key, pkg]) => (
            <PackageCard key={key} packageKey={key} pkg={pkg} />
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-600">
          Payments are processed securely via Tap Payment Gateway · KWD currency
        </p>
      </main>
    </>
  );
}

export default function ShopPage() {
  return (
    <ProtectedRoute>
      <ShopContent />
    </ProtectedRoute>
  );
}

