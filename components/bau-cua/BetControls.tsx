'use client';

const CHIPS = [
    { value: 10, color: 'bg-blue-600', label: '10' },
    { value: 50, color: 'bg-green-600', label: '50' },
    { value: 100, color: 'bg-yellow-500', label: '100' },
    { value: 500, color: 'bg-purple-600', label: '500' },
    { value: 1000, color: 'bg-red-600', label: '1K' },
];

interface BetControlsProps {
    selectedChip: number;
    onSelectChip: (value: number) => void;
    onClearBets: () => void;
    hasBets: boolean;
    disabled: boolean;
}

export default function BetControls({ selectedChip, onSelectChip, onClearBets, hasBets, disabled }: BetControlsProps) {
    const isClearDisabled = disabled || !hasBets;

    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-5 p-2 md:p-3 bg-black/40 backdrop-blur-md rounded-full border border-yellow-500/40 shadow-[0_10px_20px_rgba(0,0,0,0.5)] max-w-[98vw] overflow-x-auto scrollbar-hide">

            {CHIPS.map(chip => (
                <button
                    key={chip.value}
                    onClick={() => onSelectChip(chip.value)}
                    disabled={disabled}
                    className={`shrink-0 relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full border-4 flex items-center justify-center font-bold text-white shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-all duration-300
                    ${chip.color}
                    ${selectedChip === chip.value ? 'border-yellow-300 scale-110 shadow-[0_0_15px_rgba(253,224,71,0.8)] z-10 -translate-y-1 md:-translate-y-2' : 'border-gray-300/50 scale-95 opacity-80 hover:opacity-100 hover:-translate-y-1'}
                    ${disabled ? 'opacity-50 cursor-not-allowed grayscale-30' : 'cursor-pointer'}
                    `}
                >
                    <div className="absolute inset-0.75 md:inset-1 border-[1.5px] border-white/40 rounded-full border-dashed"></div>
                    <span className="drop-shadow-md text-xs sm:text-sm md:text-base">{chip.label}</span>
                </button>
            ))}

            <button
                onClick={onClearBets}
                disabled={isClearDisabled}
                className={`shrink-0 ml-1 sm:ml-2 md:ml-4 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border font-bold text-[9px] sm:text-[10px] md:text-xs uppercase transition-all duration-300
                    ${isClearDisabled
                        ? 'cursor-not-allowed border-gray-500 text-gray-400 bg-gray-800/60 opacity-90'
                        : 'bg-linear-to-r from-red-600 to-red-800 text-yellow-400 border-yellow-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.5)]'}
                `}
            >
                Hủy cược
            </button>
        </div>
    );
}