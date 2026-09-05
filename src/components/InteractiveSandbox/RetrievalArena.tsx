import React, { useState, useMemo } from 'react';
import { runNeedleExperiment } from '../../engine/associativeMemoryToy';

export const RetrievalArena: React.FC = () => {
  const [testSeqLen, setTestSeqLen] = useState<number>(500);
  const [needleDepth, setNeedleDepth] = useState<number>(0.5);
  const [stateDim, setStateDim] = useState<number>(32);

  const experiment = useMemo(() => {
    return runNeedleExperiment(testSeqLen, needleDepth, stateDim);
  }, [testSeqLen, needleDepth, stateDim]);

  const transFidelityPct = Math.round(experiment.transformerFidelity * 100);
  const bdhFidelityPct = Math.round(experiment.bdhFidelity * 100);
  const interferencePct = Math.round(experiment.interferenceNoise * 100);

  return (
    <div className="p-6 rounded-xl bg-white border border-stone-300 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-stone-200">
        <div>
          <h3 className="font-serif font-bold text-lg text-stone-900">
            Live Lab Test: "Needle in a Haystack" Recall vs. Interference
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Testing Ground-Truth Fact Extraction: We insert a specific key-value pair deep in the sequence. Can each model retrieve it?
          </p>
        </div>
        <div className="font-handwriting text-base text-accent-terracotta">
          Observed vs. Ground Truth Benchmark
        </div>
      </div>

      {/* Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#F4F2EB] border border-stone-300">
        <div>
          <div className="flex justify-between text-xs font-mono text-stone-700 mb-1">
            <span>Context Length (N)</span>
            <span className="font-bold">{testSeqLen} tokens</span>
          </div>
          <input
            type="range"
            min={64}
            max={2000}
            step={32}
            value={testSeqLen}
            onChange={(e) => setTestSeqLen(Number(e.target.value))}
            className="w-full h-2 bg-stone-300 rounded appearance-none cursor-pointer accent-stone-800"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
            <span>64 (Short)</span>
            <span>2,000 (Saturated)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-stone-700 mb-1">
            <span>Needle Position</span>
            <span className="font-bold">{Math.round(needleDepth * 100)}% (Token #{experiment.needlePosition})</span>
          </div>
          <input
            type="range"
            min={0.1}
            max={0.9}
            step={0.05}
            value={needleDepth}
            onChange={(e) => setNeedleDepth(Number(e.target.value))}
            className="w-full h-2 bg-stone-300 rounded appearance-none cursor-pointer accent-stone-800"
          />
          <div className="flex justify-between text-[10px] text-stone-500 font-mono mt-0.5">
            <span>10% (Start)</span>
            <span>50% (Middle)</span>
            <span>90% (Recent)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono text-stone-700 mb-1">
            <span>Synaptic Dim (d)</span>
            <span className="font-bold">{stateDim} × {stateDim}</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[16, 32, 64].map((dim) => (
              <button
                key={dim}
                onClick={() => setStateDim(dim)}
                className={`py-1 text-xs font-mono rounded border transition-all ${
                  stateDim === dim
                    ? 'bg-stone-800 text-white border-stone-800 font-bold'
                    : 'bg-white border-stone-300 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ground Truth */}
        <div className="p-4 rounded-lg border border-stone-300 bg-[#FAF9F5]">
          <div className="flex justify-between items-baseline mb-2 pb-1 border-b border-stone-200">
            <span className="font-mono text-xs uppercase font-bold text-stone-700">1. Target Needle</span>
            <span className="font-mono text-[10px] text-stone-500">Ground Truth</span>
          </div>
          <div className="font-mono text-3xl font-bold text-stone-900 my-2">100%</div>
          <p className="text-xs text-stone-600 leading-relaxed">
            The uncorrupted target vector <code className="font-mono text-stone-800 bg-stone-200/60 px-1 py-0.5 rounded">v_target</code> inserted at token #{experiment.needlePosition}.
          </p>
          <div className="mt-4 pt-2 border-t border-stone-200 font-mono text-[11px] text-stone-500">
            Cosine Similarity: 1.0000
          </div>
        </div>

        {/* Transformer */}
        <div className="p-4 rounded-lg border border-stone-300 bg-white shadow-sm">
          <div className="flex justify-between items-baseline mb-2 pb-1 border-b border-stone-200">
            <span className="font-mono text-xs uppercase font-bold text-stone-700">2. Transformer</span>
            <span className="font-mono text-[10px] text-accent-terracotta">Lossless Lookup</span>
          </div>
          <div className="font-mono text-3xl font-bold text-stone-900 my-2">
            {transFidelityPct}%
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Because every single key is kept alive in GPU memory, softmax attention easily isolates token #{experiment.needlePosition}.
          </p>
          <div className="mt-4 pt-2 border-t border-stone-200 font-mono text-[11px] flex justify-between text-stone-500">
            <span>Sim: {experiment.transformerFidelity}</span>
            <span className="text-accent-terracotta">Tax: O(N) VRAM</span>
          </div>
        </div>

        {/* BDH */}
        <div className={`p-4 rounded-lg border transition-all ${
          bdhFidelityPct >= 75
            ? 'bg-white border-stone-300'
            : bdhFidelityPct >= 50
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-rose-50/70 border-rose-300'
        }`}>
          <div className="flex justify-between items-baseline mb-2 pb-1 border-b border-stone-200">
            <span className="font-mono text-xs uppercase font-bold text-accent-olive">3. Dragon Hatchling</span>
            <span className="font-mono text-[10px] text-stone-500">Recurrent State</span>
          </div>
          <div className={`font-mono text-3xl font-bold my-2 ${
            bdhFidelityPct >= 75 ? 'text-accent-olive' : bdhFidelityPct >= 50 ? 'text-amber-800' : 'text-rose-700'
          }`}>
            {bdhFidelityPct}%
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Synaptic projection <code className="font-mono text-accent-olive">y = S · q</code> extracts the vector. Noise creeps in as context length surpasses matrix rank.
          </p>
          <div className="mt-4 pt-2 border-t border-stone-200 font-mono text-[11px] flex justify-between text-stone-500">
            <span>Interference: {interferencePct}%</span>
            <span className="text-accent-olive font-bold">Cost: O(1) Memory</span>
          </div>
        </div>
      </div>

      {/* Explanatory takeaway */}
      <div className="p-4 rounded-lg bg-[#FAF9F5] border border-stone-300 text-xs text-stone-700 leading-relaxed space-y-1">
        <div className="font-serif font-bold text-stone-900 text-sm">
          Why does this happen? (The Scientific Mechanism)
        </div>
        <p>
          {experiment.explanation}
        </p>
        <p className="text-stone-600">
          In a Transformer, the memory tape expands infinitely so keys never touch each other. In Dragon Hatchling, facts are stored in superposition inside a fixed synaptic matrix <span className="font-mono">S ∈ ℝ^{stateDim}×{stateDim}</span>. When <span className="font-mono">N &gt; d</span>, the vectors can no longer be linearly independent, producing background crosstalk.
        </p>
      </div>
    </div>
  );
};
