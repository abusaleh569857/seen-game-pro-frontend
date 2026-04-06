'use client';

import { useSelector } from 'react-redux';

const JOKERS = [
  { type: 'fifty_fifty', label: '50/50', icon: '??', cost: 1 },
  { type: 'skip', label: 'Skip', icon: '??', cost: 1 },
  { type: 'time', label: '+10s', icon: '??', cost: 1 },
  { type: 'reveal', label: 'Reveal', icon: '??', cost: 2 },
];

export default function JokerDock({ onUse, disabled }) {
  const inventory = useSelector((state) => state.quiz.inventory);

  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-gray-800 bg-gray-900/95 p-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl justify-around gap-2">
        {JOKERS.map((joker) => {
          const quantity = inventory?.[joker.type] ?? 0;

          return (
            <button
              key={joker.type}
              type="button"
              onClick={() => onUse(joker.type)}
              disabled={disabled}
              className="flex min-w-[78px] flex-col items-center gap-1 rounded-xl border border-gray-700 bg-gray-800 px-3 py-2 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 hover:border-purple-500"
            >
              <span className="text-2xl">{joker.icon}</span>
              <span className="text-xs font-medium text-gray-300">{joker.label}</span>
              <span className="text-xs font-bold">
                {quantity > 0 ? (
                  <span className="text-green-400">x{quantity}</span>
                ) : (
                  <span className="text-yellow-400">{joker.cost}??</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

