import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BDHStateMatrixProps {
  seqLen: number;
}

export const BDHStateMatrix: React.FC<BDHStateMatrixProps> = () => {
  const matrixSize = 8;
  const [synapses, setSynapses] = useState<number[][]>(() =>
    Array.from({ length: matrixSize }, () =>
      Array.from({ length: matrixSize }, () => Math.random() * 0.3)
    )
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fireHebbianUpdate = () => {
    setSynapses((prev) => {
      const activeRow = Math.floor(Math.random() * matrixSize);
      const activeCol = Math.floor(Math.random() * matrixSize);
      return prev.map((row, r) =>
        row.map((val, c) => {
          const decayed = val * 0.95;
          const boost = (r === activeRow || c === activeCol) ? Math.random() * 0.6 : 0;
          return Math.min(1.0, decayed + boost);
        })
      );
    });
  };

  useEffect(() => {
    let timer: any = null;
    if (isUpdating) {
      timer = setInterval(fireHebbianUpdate, 140);
    }
    return () => clearInterval(timer);
  }, [isUpdating]);

  return (
    <div className="p-5 rounded-xl bg-white border border-stone-300 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-3">
        <div>
          <h4 className="font-serif font-bold text-sm text-stone-900">
            Dragon Hatchling: Synaptic Recurrent State (S<sub>t</sub> ∈ ℝ<sup>d×d</sup>)
          </h4>
          <span className="font-mono text-[11px] text-accent-olive font-semibold">
            Allocation: 0 new blocks (In-place update)
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setIsUpdating(!isUpdating)}
            className="px-2 py-1 rounded bg-[#F4F2EB] hover:bg-stone-200 text-stone-700 text-xs font-mono flex items-center space-x-1 border border-stone-300"
          >
            {isUpdating ? <Pause className="w-3 h-3 text-accent-terracotta" /> : <Play className="w-3 h-3 text-stone-700" />}
            <span>{isUpdating ? 'Pause' : 'Stream'}</span>
          </button>
          <button
            onClick={() => {
              setIsUpdating(false);
              setSynapses(
                Array.from({ length: matrixSize }, () =>
                  Array.from({ length: matrixSize }, () => Math.random() * 0.3)
                )
              );
            }}
            className="p-1 rounded bg-[#F4F2EB] hover:bg-stone-200 text-stone-500 border border-stone-300"
            title="Reset Synaptic State"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-600 mb-3 leading-relaxed">
        Incoming tokens rewire existing synaptic connections in place via Hebbian outer products (<code className="font-mono text-accent-olive">vₜ · kₜᵀ</code>). No new memory cells are ever created.
      </p>

      {/* Synaptic Heatmap Grid */}
      <div className="grid grid-cols-8 gap-1 p-3 rounded-lg bg-[#F4F2EB] border border-stone-300 mb-3 flex-1 items-center">
        {synapses.map((row, r) =>
          row.map((weight, c) => {
            const intensity = Math.round(weight * 255);
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  backgroundColor: `rgba(90, 107, 71, ${Math.max(0.12, weight)})`,
                }}
                className="h-6 rounded border border-stone-300/80 transition-colors duration-150 flex items-center justify-center text-[9px] font-mono text-white font-bold"
                title={`Synapse [${r},${c}] weight: ${weight.toFixed(2)}`}
              >
                {weight > 0.65 ? '•' : ''}
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-stone-200 text-stone-600">
        <span>Fixed Geometry: <strong>8×8 Synapses</strong></span>
        <span className="text-accent-olive font-bold">O(1) Spatial Overhead</span>
      </div>
    </div>
  );
};
