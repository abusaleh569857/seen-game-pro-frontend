export default function SocialAuthButton({ provider, label, onClick, disabled = false }) {
  const icon =
    provider === 'google' ? (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.7 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12S6.8 21.5 12 21.5c6.9 0 9.1-4.8 9.1-7.3 0-.5 0-.8-.1-1.2H12Z" />
        <path fill="#34A853" d="M3.7 7.5 6.9 9.8C7.8 7.6 9.7 6 12 6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.7 2.5 12 2.5 8.3 2.5 5.2 4.6 3.7 7.5Z" />
        <path fill="#FBBC05" d="M12 21.5c2.6 0 4.8-.9 6.4-2.4l-3-2.5c-.8.6-1.9 1.1-3.4 1.1-3.7 0-5.1-2.6-5.4-3.8l-3.1 2.4C5 19.3 8.2 21.5 12 21.5Z" />
        <path fill="#4285F4" d="M3.5 16.3 6.7 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2L3.5 7.7C2.9 9 2.6 10.5 2.6 12s.3 3 1 4.3Z" />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.8v-8.4H7v-3.5h3.1V9.2c0-3.1 1.9-4.8 4.7-4.8 1.4 0 2.8.2 2.8.2v3h-1.6c-1.6 0-2.1 1-2.1 2.1v2.5h3.6l-.6 3.5h-3v8.4A12 12 0 0 0 24 12Z" />
      </svg>
    );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
