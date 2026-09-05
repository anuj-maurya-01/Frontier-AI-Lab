import React, { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { calculateMemory, ARCHITECTURE_PRESETS } from '../engine/memoryFormulas';

interface HeroHookProps {
  onExploreClick: () => void;
}

export const HeroHook: React.FC<HeroHookProps> = () => {
  const [tokens, setTokens] = useState<number>(32768);

  const llama70bMem = calculateMemory(ARCHITECTURE_PRESETS['llama3-70b'], tokens, 2, 'FP16');
  const bdh1bMem = calculateMemory(ARCHITECTURE_PRESETS['bdh-1b'], tokens, 2, 'FP16');

  return (
    <section id="hero" className="pt-10 pb-14 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Author Byline */}
        <div className="text-xs text-stone-500 font-sans pb-3 mb-6 flex items-center justify-between border-b border-stone-200">
          <span className="font-medium text-stone-800">By Anuj & the DataForge Team</span>
          <span>6 min interactive read</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 tracking-tight leading-[1.18] mb-6">
          I crashed an $80,000 GPU cluster with a PDF file. Here’s why.
        </h1>

        {/* Narrative story */}
        <div className="font-serif text-lg text-stone-800 leading-relaxed space-y-4 mb-8">
          <p>
            Last week, we were trying to run Llama-3 70B on a 60-page research paper. 
            The model weights took up roughly 140 GB across two GPUs. Everything hummed along smoothly—until token 45,000.
          </p>
          <div className="font-mono text-xs sm:text-sm bg-stone-900 text-rose-300 p-3.5 rounded-lg border border-stone-800 leading-relaxed">
            torch.cuda.OutOfMemoryError: Tried to allocate 16.40 GiB (GPU 0; 79.25 GiB total capacity; 72.10 GiB already allocated)
          </div>
          <p>
            Here’s the thing that bugged me: <span className="highlight-pen font-semibold">The model weights didn't get bigger.</span> We didn't add layers. The model wasn't learning new weights. So what on earth ate those extra 16 gigabytes?
          </p>
          <p className="text-base text-stone-700">
            The culprit is the <strong>Key-Value (KV) cache</strong>. Every word you feed a Transformer adds new vectors to GPU memory. When sequence length scales to 128k tokens, memory scales linearly <span className="font-mono font-semibold text-rose-700">O(N)</span> until your GPU dies. But in biologically inspired models like Pathway's <strong>Dragon Hatchling (BDH)</strong>, recurrent memory stays strictly constant <span className="font-mono font-semibold text-accent-olive">O(1)</span>.
          </p>
        </div>

        {/* Sticky Note */}
        <div className="sticky-note p-4 rounded-lg mb-8 max-w-lg mx-auto sm:rotate-[-1deg]">
          <div className="font-handwriting text-xl sm:text-2xl text-stone-800 leading-snug">
            "The model weights are frozen. But the memory tape never stops recording every single word you feed it."
          </div>
        </div>

        {/* Interactive slider teaser */}
        <div className="p-6 rounded-xl border border-stone-300 bg-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                See it happen live: Drag to 64k words
              </h2>
              <p className="text-xs text-stone-600">
                Watch how standard attention explodes in memory compared to Dragon Hatchling.
              </p>
            </div>
            <div className="font-mono text-sm font-bold bg-[#F4F2EB] px-3 py-1 rounded border border-stone-300 text-stone-800">
              {tokens.toLocaleString()} tokens
            </div>
          </div>

          <div className="pt-2">
            <input
              type="range"
              min={4096}
              max={131072}
              step={4096}
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value))}
              className="w-full h-2.5 bg-stone-200 rounded appearance-none cursor-pointer accent-stone-900"
            />
            <div className="flex justify-between text-[11px] font-mono text-stone-500 mt-1">
              <span>4k tokens</span>
              <span>32k tokens</span>
              <span>64k tokens</span>
              <span>128k tokens</span>
            </div>

            {tokens >= 65536 && (
              <div className="font-handwriting text-accent-terracotta text-base sm:text-lg text-right mt-1 animate-pulse">
                ⤴ Look at that red bar—we just overflowed an 80GB GPU.
              </div>
            )}
          </div>

          {/* Side by side comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Llama 70B */}
            <div className={`p-4 rounded-lg border transition-all ${
              llama70bMem.oomStatus === 'OOM_CRITICAL'
                ? 'bg-rose-50 border-rose-400'
                : 'bg-[#FAF9F5] border-stone-300'
            }`}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-serif font-bold text-sm text-stone-900">
                  Transformer (Llama-3 70B)
                </span>
                <span className="font-mono text-[10px] text-stone-500">O(N)</span>
              </div>
              <div className="font-mono text-3xl font-bold text-stone-900 my-1">
                {llama70bMem.gigabytes.toFixed(1)} GB
              </div>
              <div className="text-xs text-stone-600 mb-2 font-sans">
                Memory just for context history (2 users, FP16)
              </div>

              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className={`h-full transition-all ${
                    llama70bMem.oomStatus === 'OOM_CRITICAL' ? 'bg-rose-600' : 'bg-stone-800'
                  }`}
                  style={{ width: `${Math.min(100, llama70bMem.vramPercentageOfA100_80GB)}%` }}
                />
              </div>

              {llama70bMem.oomStatus === 'OOM_CRITICAL' ? (
                <div className="text-xs font-mono text-rose-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>CUDA Out-of-Memory! Server dead.</span>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-stone-500">
                  {(llama70bMem.vramPercentageOfA100_80GB).toFixed(0)}% of an 80GB A100 consumed
                </div>
              )}
            </div>

            {/* BDH */}
            <div className="p-4 rounded-lg border border-stone-300 bg-[#FAF9F5]">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-serif font-bold text-sm text-accent-olive">
                  Dragon Hatchling (BDH 1B)
                </span>
                <span className="font-mono text-[10px] text-stone-500">O(1)</span>
              </div>
              <div className="font-mono text-3xl font-bold text-accent-olive my-1">
                {bdh1bMem.megabytes.toFixed(1)} MB
              </div>
              <div className="text-xs text-stone-600 mb-2 font-sans">
                Synaptic state matrix (never expands)
              </div>

              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-2">
                <div className="h-full bg-accent-olive" style={{ width: '1%' }} />
              </div>

              <div className="text-xs font-mono text-accent-olive font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Zero new memory allocated. Flat line.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
