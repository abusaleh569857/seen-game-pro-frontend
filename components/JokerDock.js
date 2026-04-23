'use client';

import { useSelector } from 'react-redux';
import { useI18n } from '@/lib/i18n';
import { Clock3, Eye, Scissors, SkipForward } from 'lucide-react';

const JOKERS = [
  { type: 'fifty_fifty', label: '50/50', icon: Scissors, cost: 1 },
  { type: 'skip', labelKey: 'shop.skip_label', icon: SkipForward, cost: 1 },
  { type: 'time', labelKey: 'shop.time_label', icon: Clock3, cost: 1 },
  { type: 'reveal', labelKey: 'shop.reveal_label', icon: Eye, cost: 2 },
];

export default function JokerDock({ onUse, disabled }) {
  const inventory = useSelector((state) => state.quiz.inventory);
  const { t } = useI18n();

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-gray-800 bg-gray-900/95 p-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl justify-around gap-2">
        {JOKERS.map((joker) => {
          const quantity = inventory?.[joker.type] ?? 0;
          const Icon = joker.icon;

          return (
            <button
              key={joker.type}
              type="button"
              onClick={() => onUse(joker.type)}
              disabled={disabled}
              className="flex min-w-[78px] flex-col items-center gap-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 hover:border-purple-500"
            >
              <Icon className="h-5 w-5 text-gray-200" />
              <span className="text-xs font-medium text-gray-300">{joker.labelKey ? t(joker.labelKey) : joker.label}</span>
              <span className="text-xs font-bold">
                {quantity > 0 ? (
                  <span className="text-green-400">x{quantity}</span>
                ) : (
                  <span className="text-yellow-400">{joker.cost} {t('common.qeem')}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

