import React from 'react';

export const LimitationsAndTradeoffs: React.FC = () => {
  return (
    <section id="tradeoffs" className="py-16 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
          The Honest Truth: Why haven’t we replaced all Transformers yet?
        </h2>
        <p className="font-serif text-lg text-stone-700 leading-relaxed mb-6">
          If Dragon Hatchling uses thousands of times less memory than a Transformer, why isn't every AI lab ditching attention tomorrow? Because there is no free lunch in computer science.
        </p>

        {/* The Two Sides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="p-5 rounded-lg border border-stone-300 bg-white shadow-sm space-y-2">
            <span className="font-mono text-xs uppercase font-bold text-stone-500">
              Why Transformers are still king:
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Lossless Memory
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              In a Transformer, token #42 sits in its own dedicated memory slot. It never touches token #43. Even after 100,000 words, you can pull token #42 back out with 100% precision.
            </p>
            <div className="text-xs font-mono text-rose-700 font-semibold pt-1">
              Downside: Requires warehouse-scale GPU memory.
            </div>
          </div>

          <div className="p-5 rounded-lg border border-stone-300 bg-white shadow-sm space-y-2">
            <span className="font-mono text-xs uppercase font-bold text-accent-olive">
              Why Dragon Hatchling is different:
            </span>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Bounded State Capacity
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              In BDH, tokens are superimposed into a single fixed matrix. You cannot pack 100,000 distinct facts into a 512×512 matrix without them stepping on each other’s toes.
            </p>
            <div className="text-xs font-mono text-accent-olive font-semibold pt-1">
              Downside: Background interference noise over long horizons.
            </div>
          </div>
        </div>

        {/* Superposition Explanation */}
        <div className="p-5 rounded-xl border border-stone-300 bg-[#F4F2EB] mb-8 font-serif">
          <h4 className="font-bold text-base text-stone-900 mb-1.5">
            The Rank Bound: Packing vectors into a finite box
          </h4>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            In linear algebra, a matrix of size <code>d × d</code> has rank at most <code>d</code>. That means it can hold at most <code>d</code> vectors that don't interfere with each other. As soon as your sequence length <code className="font-mono bg-stone-200/80 px-1 rounded">N &gt; d</code>, older memories begin to blur together—just like human memory blurs what you had for lunch three weeks ago unless it was reinforced.
          </p>
        </div>

        {/* The Hybrid Future */}
        <div className="p-5 rounded-lg border border-stone-300 bg-white space-y-2 font-serif">
          <h4 className="font-bold text-base text-stone-900">
            Where the industry is actually heading: Hybrids
          </h4>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
            The smart move isn't picking 100% Transformer or 100% Recurrent. Most frontier researchers believe the future is <strong>hybrid models</strong>: use a small sliding window of exact attention (e.g. the last 2,000 words) for verbatim quotes and syntax, combined with a biological recurrent state (like BDH) to carry context across millions of tokens without ever crashing your GPU.
          </p>
        </div>
      </div>
    </section>
  );
};
