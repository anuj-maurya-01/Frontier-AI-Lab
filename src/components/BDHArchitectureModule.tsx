import React from 'react';
import { ExternalLink } from 'lucide-react';

export const BDHArchitectureModule: React.FC = () => {
  return (
    <section id="bdh" className="py-14 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
          What Pathway Built: Dragon Hatchling & BDH-CQ
        </h2>
        <p className="font-serif text-lg text-stone-700 leading-relaxed mb-6">
          Instead of scaling up more clusters of power-hungry GPUs, researchers at Pathway took inspiration from neuroscience. Here is how it works.
        </p>

        {/* Paper 1: Dragon Hatchling */}
        <div className="p-6 rounded-xl border border-stone-300 bg-white shadow-sm space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              1. The Dragon Hatchling (BDH)
            </h3>
            <a
              href="https://arxiv.org/abs/2509.26507"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-accent-terracotta hover:underline inline-flex items-center gap-1"
            >
              <span>arXiv:2509.26507</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed space-y-3">
            <p>
              Published in September 2025 by Adrian Kosowski, Przemysław Uznański, and their Pathway colleagues. Instead of treating neural networks as monolithic matrix multiplications, they modeled the network as a scale-free graph of interacting <strong>neuron particles</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs pt-1">
              <div className="p-3 rounded bg-[#FAF9F5] border border-stone-200">
                <strong className="text-stone-900 block font-bold mb-1">Synapses replace the cache:</strong>
                As the model reads text, it strengthens or weakens internal synaptic connections. It doesn't store tokens; it stores connection strengths.
              </div>
              <div className="p-3 rounded bg-[#FAF9F5] border border-stone-200">
                <strong className="text-stone-900 block font-bold mb-1">Monosemantic neurons:</strong>
                Activations are sparse and positive, so individual neurons correspond to clear concepts, making it far more interpretable than a standard LLM.
              </div>
            </div>
          </div>
        </div>

        {/* Paper 2: BDH-CQ */}
        <div className="p-6 rounded-xl border border-stone-300 bg-white shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-3 border-b border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              2. BDH-CQ: Thinking Without Spilling Words
            </h3>
            <a
              href="https://arxiv.org/abs/2608.09888"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-accent-terracotta hover:underline inline-flex items-center gap-1"
            >
              <span>arXiv:2608.09888</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed space-y-3">
            <p>
              Modern "reasoning" models like OpenAI o1 solve puzzles by generating thousands of hidden "thinking tokens". But that makes the KV cache problem worse—all those intermediate words pile up in GPU memory.
            </p>
            <p>
              Pathway’s <strong>BDH-CQ</strong> iterates its recurrent state in continuous latent space without emitting text tokens.
            </p>
            <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 font-sans text-xs leading-relaxed text-stone-800">
              <strong>The ARC-AGI-1 Benchmark:</strong> On Francois Chollet's ARC-AGI-1 visual logic benchmark, a compact 150M parameter BDH-CQ achieved <strong>29.5% pass@2</strong> at an inference cost of just <strong>$0.0007 per task</strong>, matching massive general-purpose models at a fraction of the cost.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
