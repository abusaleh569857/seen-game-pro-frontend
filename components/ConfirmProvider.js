'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const ConfirmContext = createContext(null);

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) {
    throw new Error('useConfirm must be used inside ConfirmProvider');
  }
  return confirm;
}

export default function ConfirmProvider({ children }) {
  const { t } = useI18n();
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(
    ({ title, message, confirmLabel, cancelLabel, tone = 'default' }) =>
      new Promise((resolve) => {
        setDialog({
          title: title || t('common.are_you_sure'),
          message,
          confirmLabel: confirmLabel || t('common.confirm'),
          cancelLabel: cancelLabel || t('common.cancel'),
          tone,
          resolve,
        });
      }),
    [t],
  );

  const close = useCallback(
    (value) => {
      if (dialog?.resolve) {
        dialog.resolve(value);
      }
      setDialog(null);
    },
    [dialog],
  );

  const value = useMemo(() => confirm, [confirm]);
  const confirmButtonClass =
    dialog?.tone === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 focus:ring-rose-500/30'
      : 'bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-500/30';

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[380px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-950">{dialog.title}</h2>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{dialog.message}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200/60"
              >
                {dialog.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => close(true)}
                className={`rounded-xl px-4 py-2.5 text-sm font-black text-white transition focus:outline-none focus:ring-4 ${confirmButtonClass}`}
              >
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConfirmContext.Provider>
  );
}
