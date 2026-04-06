import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-red-700 bg-gray-900 p-10 text-center">
        <div className="mb-4 text-6xl">?</div>
        <h1 className="mb-2 text-2xl font-bold text-red-400">Payment Failed</h1>
        <p className="mb-6 text-gray-400">Something went wrong. Please try again.</p>
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

