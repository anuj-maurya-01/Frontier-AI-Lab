import React, { useState } from 'react';

export const MathematicalDeepDive: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'transformer' | 'linear' | 'bdh'>('transformer');

  return (
    <section id="math" className="py-16 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
          The Math (Just two equations, we promise)
        </h2>
        <p className="font-serif text-lg text-stone-700 leading-relaxed mb-6">
          Why can't we just pre-calculate a running summary of past words? It turns out one specific mathematical operator is holding the entire AI industry hostage: <code className="font-mono text-sm bg-stone-200/70 px-1.5 py-0.5 rounded text-stone-900 font-semibold">softmax()</code>.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-stone-300 mb-6 font-sans text-xs">
          <button
            onClick={() => setActiveTab('transformer')}
            className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'transformer'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Standard Softmax Attention
          </button>
          <button
            onClick={() => setActiveTab('linear')}
            className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'linear'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. The Matrix Multiplication Trick
          </button>
          <button
            onClick={() => setActiveTab('bdh')}
            className={`pb-2 px-3 font-medium transition-colors border-b-2 ${
              activeTab === 'bdh'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Dragon Hatchling Synapses
          </button>
        </div>

        {/* Tab Content Box */}
        <div className="p-6 rounded-xl border border-stone-300 bg-white shadow-sm space-y-5">
          {activeTab === 'transformer' && (
            <div className="space-y-4 font-serif">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg text-stone-900">
                  The Softmax Trap
                </h3>
                <span className="font-mono text-xs text-rose-700 font-semibold">
                  Why memory scales O(N)
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F2EB] border border-stone-300 font-mono text-xs sm:text-sm text-stone-900 overflow-x-auto">
                {'Attention(Q, K, V) = softmax( (Q · Kᵀ) / √dₖ ) · V'}
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                In school, you learned that <code className="font-mono text-xs bg-stone-100 px-1 rounded">(A × B) × C = A × (B × C)</code>. That's the associative property of multiplication.
              </p>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                If attention followed that rule, we could multiply <code className="font-mono text-xs">Kᵀ · V</code> first, squish all past words into a neat little matrix, and update it one token at a time!
              </p>
              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                So why can’t we? Look at what <code>softmax</code> actually does when you write it out for one word:
              </p>

              <div className="p-4 rounded-lg bg-[#FAF9F5] border border-stone-300 font-mono text-xs text-stone-800 overflow-x-auto">
                {'yₜ = ∑ⱼ [ exp( (qₜ · kⱼᵀ) / √dₖ ) / ( ∑ₘ exp( (qₜ · kₘᵀ) / √dₖ ) ) ] · vⱼ'}
              </div>

              <div className="sticky-note p-4 rounded-lg text-xs leading-relaxed text-stone-800">
                <div className="font-handwriting text-xl text-accent-terracotta mb-1">
                  ✎ See that denominator? That's the villain.
                </div>
                Because the bottom part sums up the exponents of <em>every single word simultaneously</em>, the current word <code>qₜ</code> is trapped inside the calculation with all past words <code>kₘ</code>. You cannot pull them apart. You are forced to save every single key vector in GPU memory forever.
              </div>
            </div>
          )}

          {activeTab === 'linear' && (
            <div className="space-y-4 font-serif">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg text-stone-900">
                  What if we remove softmax?
                </h3>
                <span className="font-mono text-xs text-accent-olive font-semibold">
                  Why memory stays O(1)
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F2EB] border border-stone-300 font-mono text-xs sm:text-sm text-stone-900 overflow-x-auto">
                {'( φ(Q) · φ(K)ᵀ ) · V  ==  φ(Q) · ( φ(K)ᵀ · V )'}
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                If you replace the exponential softmax with a linear feature map <code>φ(·)</code>, the associative property suddenly works again! You can multiply <code>Kᵀ · V</code> first:
              </p>

              <div className="p-4 rounded-lg bg-[#FAF9F5] border border-stone-300 font-mono text-xs text-stone-800 overflow-x-auto space-y-1">
                <div className="text-stone-500 text-[11px]">// Keep a running state matrix S of size (d × d):</div>
                <div className="font-bold text-stone-900">{'Sₜ = Sₜ₋₁ + φ(kₜ)ᵀ · vₜ'}</div>
                <div className="text-stone-500 text-[11px] mt-2">// When you need to read the memory:</div>
                <div className="font-bold text-stone-900">{'yₜ = φ(qₜ) · Sₜ'}</div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed">
                <strong>Why this is huge:</strong> The state matrix <code className="font-mono bg-emerald-100 px-1 rounded">S</code> is always size <code>d × d</code>. Whether you've fed the model 10 words or 10,000,000 words, it stays the exact same size in memory. It literally cannot run out of RAM!
              </div>
            </div>
          )}

          {activeTab === 'bdh' && (
            <div className="space-y-4 font-serif">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-lg text-stone-900">
                  Dragon Hatchling: Biological Synapses
                </h3>
                <span className="font-mono text-xs text-accent-terracotta font-semibold">
                  Kosowski et al. (Pathway, 2025)
                </span>
              </div>

              <div className="p-4 rounded-lg bg-[#F4F2EB] border border-stone-300 font-mono text-xs sm:text-sm text-stone-900 overflow-x-auto">
                {'Sₜ = λ·Sₜ₋₁ + η · ( σ⁺(xₜ) ⊗ σ⁺(xₜ) ) - γ·Sₜ₋₁'}
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                Researchers at Pathway realized this linear update looks almost identical to biological synaptic plasticity: <strong>Hebbian learning</strong> ("neurons that fire together wire together").
              </p>

              <ul className="list-disc pl-5 space-y-1 text-sm text-stone-700 font-sans">
                <li><strong>Local Rewiring:</strong> Tokens modify connection weights in place, just like synapses in your brain.</li>
                <li><strong>Sparse Firing (σ⁺):</strong> Most neurons stay quiet; only a few fire, making the network easy to interpret.</li>
                <li><strong>Homeostasis (γ):</strong> Synapses gradually decay so old weights don't blow up to infinity.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
