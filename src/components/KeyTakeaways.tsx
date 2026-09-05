import React from 'react';

export const KeyTakeaways: React.FC = () => {
  return (
    <section id="takeaways" className="py-14 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-6">
          Key Takeaways (The 3 Things to Remember)
        </h2>

        <div className="space-y-4 font-serif">
          <div className="p-4 rounded-lg border border-stone-300 bg-white flex items-start space-x-3">
            <span className="font-mono text-sm font-bold text-stone-900 bg-stone-100 border border-stone-300 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <strong className="text-stone-900 block font-sans text-sm font-bold mb-0.5">
                The KV cache is a forced compromise, not an inherent requirement of intelligence.
              </strong>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Transformers store every single past word in memory because the softmax denominator couples queries and keys together. It prevents pre-accumulating past tokens into a fixed-size running summary.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-stone-300 bg-white flex items-start space-x-3">
            <span className="font-mono text-sm font-bold text-stone-900 bg-stone-100 border border-stone-300 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <strong className="text-stone-900 block font-sans text-sm font-bold mb-0.5">
                Biological synapses maintain strictly O(1) constant memory.
              </strong>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                Dragon Hatchling (BDH) replaces external token storage with an internal recurrent state matrix that rewires in place using local Hebbian plasticity ("fire together, wire together"). Memory footprint remains ~16 MB whether context is 500 or 5,000,000 tokens.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-stone-300 bg-white flex items-start space-x-3">
            <span className="font-mono text-sm font-bold text-stone-900 bg-stone-100 border border-stone-300 w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <strong className="text-stone-900 block font-sans text-sm font-bold mb-0.5">
                The inevitable future is hybrid.
              </strong>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                A fixed-size matrix cannot store infinite distinct facts without interference noise (the rank bound). The winning sequence architecture will combine short local attention for exact verbatim quotes with recurrent synaptic states for unbounded global context.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
