'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-800 bg-gray-900/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link
          href="/"
          className="text-xl font-bold text-purple-400 transition hover:text-purple-300"
        >
          Seen Game Pro
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link href="/leaderboard" className="text-gray-300 transition hover:text-white">
            Leaderboard
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/shop"
                className="flex items-center gap-1 rounded-full border border-yellow-700 bg-yellow-900 px-3 py-1 text-xs font-bold text-yellow-300 transition hover:bg-yellow-800"
              >
                <span>Qeem</span>
                <span>{user?.qeemBalance ?? user?.qeem_balance ?? 0}</span>
              </Link>

              <Link
                href="/profile"
                className="hidden text-gray-300 transition hover:text-white sm:block"
              >
                {user?.username}
              </Link>

              {user?.role === 'admin' ? (
                <Link
                  href="/admin"
                  className="text-xs font-bold text-red-400 transition hover:text-red-300"
                >
                  ADMIN
                </Link>
              ) : null}

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-1 text-xs transition hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 transition hover:text-white">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold transition hover:bg-purple-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}