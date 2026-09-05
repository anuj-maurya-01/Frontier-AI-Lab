import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface KVMemoryGridProps {
  seqLen: number;
}

export const KVMemoryGrid: React.FC<KVMemoryGridProps> = ({ seqLen }) => {
  const [activeTokens, setActiveTokens] = useState<number>(32);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const mapped = Math.min(64, Math.max(8, Math.round((seqLen / 131072) * 64)));
    setActiveTokens(mapped);
  }, [seqLen]);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setActiveTokens((prev) => {
          if (prev >= 64) {
            setIsPlaying(false);
            return 64;
          }
          return prev + 1;
        });
      }, 120);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const totalSlots = 64;
  const isFull = activeTokens >= 60;

  return (
    <div className="p-5 rounded-xl bg-white border border-stone-300 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
        <div>
          <h4 className="font-serif font-bold text-sm text-stone-900">
            Transformer: Append-Only Memory Tape
          </h4>
          <span className="font-mono text-[11px] text-stone-500">
            Allocation: +1 memory block / token
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2 py-1 rounded bg-[#F4F2EB] hover:bg-stone-200 text-stone-700 text-xs font-mono flex items-center space-x-1 border border-stone-300"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-accent-terracotta" /> : <Play className="w-3 h-3 text-stone-700" />}
            <span>{isPlaying ? 'Pause' : 'Stream'}</span>
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setActiveTokens(8);
            }}
            className="p-1 rounded bg-[#F4F2EB] hover:bg-stone-200 text-stone-500 border border-stone-300"
            title="Reset Tape"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-600 mb-3 leading-relaxed">
        Every generated token allocates new RAM addresses for its Key and Value vectors. These vectors remain permanently pinned in memory until generation ends.
      </p>

      {/* Memory slots tape */}
      <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 p-3 rounded-lg bg-[#F4F2EB] border border-stone-300 mb-3 flex-1 items-center">
        {Array.from({ length: totalSlots }).map((_, idx) => {
          const isAllocated = idx < activeTokens;
          const isLatest = idx === activeTokens - 1;
          const isCritical = idx >= 56;

          return (
            <div
              key={idx}
              className={`h-6 rounded text-[9px] font-mono flex items-center justify-center transition-all ${
                isLatest
                  ? 'bg-accent-terracotta text-white font-bold scale-105 shadow-sm'
                  : isAllocated
                  ? isCritical
                    ? 'bg-rose-700 text-white'
                    : 'bg-stone-800 text-stone-100'
                  : 'bg-white border border-stone-300 text-stone-400'
              }`}
            >
              {isAllocated ? (idx < 9 ? `0${idx + 1}` : idx + 1) : '·'}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-stone-200 text-stone-600">
        <span>Allocated: <strong>{activeTokens} / {totalSlots} Blocks</strong></span>
        {isFull ? (
          <span className="text-rose-700 font-bold">Tape Full (OOM Risk)</span>
        ) : (
          <span className="text-stone-500">+1 block / step</span>
        )}
      </div>
    </div>
  );
};
