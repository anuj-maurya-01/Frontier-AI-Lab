import React from 'react';

export const ProblemFraming: React.FC = () => {
  return (
    <section id="bottleneck" className="py-14 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-4">
          Wait, why can’t we just throw old words away?
        </h2>

        <div className="font-serif text-lg text-stone-800 leading-relaxed space-y-4 mb-8">
          <p>
            When people first encounter the KV cache, their immediate thought is: 
            <em> “Why can't the model just discard earlier words, or summarize them into a sentence?”</em>
          </p>
          <p>
            The reason comes down to how attention was built. To generate word 5,001, the attention layer wants to calculate a direct dot product against <strong className="text-stone-900">every single word that came before it</strong>.
          </p>
          <p>
            If you don't save past representations, you have to re-run the entire neural network across all 5,000 words on every single step—taking minutes per token. So engineers chose the only fast alternative: <strong>cache every token's Key and Value vector into GPU memory</strong>.
          </p>
        </div>

        {/* Real-world Metaphor Sticky Note */}
        <div className="sticky-note p-4 rounded-lg max-w-xl mx-auto mb-10">
          <div className="font-handwriting text-xl sm:text-2xl text-stone-800 leading-snug">
            "It's like grocery shopping with a receipt you can never tear off. By aisle 12, the paper receipt trailing behind you is four miles long and you need a second shopping cart just to carry the paper."
          </div>
        </div>

        {/* Memory breakdown chart */}
        <div className="border border-stone-300 rounded-lg overflow-hidden bg-white">
          <div className="px-5 py-3 bg-[#F4F2EB] border-b border-stone-300 flex justify-between items-baseline">
            <span className="font-serif text-sm font-bold text-stone-900">
              Where your GPU memory actually goes (Llama-3 70B at 128k context)
            </span>
            <span className="font-mono text-xs text-stone-500">FP16 precision</span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-stone-700 mb-1">
                <span>The neural network itself (Weights)</span>
                <span className="font-bold">~140 GB (Fixed baseline)</span>
              </div>
              <div className="w-full bg-stone-200 rounded h-2.5 overflow-hidden">
                <div className="bg-stone-800 h-full w-[47%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-stone-700 mb-1">
                <span>KV Cache for 1 user (128,000 words)</span>
                <span className="text-accent-terracotta font-bold">40 GB (Half an A100 GPU)</span>
              </div>
              <div className="w-full bg-stone-200 rounded h-2.5 overflow-hidden">
                <div className="bg-accent-terracotta h-full w-[25%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-stone-700 mb-1">
                <span className="text-rose-700 font-bold">KV Cache for just 4 concurrent users</span>
                <span className="text-rose-700 font-bold">160 GB! (Two entire $10,000 GPUs)</span>
              </div>
              <div className="w-full bg-stone-200 rounded h-2.5 overflow-hidden">
                <div className="bg-rose-600 h-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
