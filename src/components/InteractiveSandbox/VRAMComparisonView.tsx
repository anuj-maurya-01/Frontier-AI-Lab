import React from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { ModelArchitecture, MemoryResult } from '../../engine/memoryFormulas';

interface VRAMComparisonViewProps {
  transformer: ModelArchitecture;
  transformerMemory: MemoryResult;
  bdh: ModelArchitecture;
  bdhMemory: MemoryResult;
  seqLen: number;
  batchSize: number;
}

export const VRAMComparisonView: React.FC<VRAMComparisonViewProps> = ({
  transformer,
  transformerMemory,
  bdh,
  bdhMemory,
  seqLen,
  batchSize,
}) => {
  const reductionFactor = Math.max(
    1,
    Math.round((transformerMemory.rawBytes || 1) / (bdhMemory.rawBytes || 1))
  );

  const maxStreamsTransformer = transformerMemory.bytesPerToken
    ? Math.max(0, Math.floor((80 * 1024 * 1024 * 1024) / (transformerMemory.bytesPerToken * seqLen)))
    : 0;

  const bdhStateBytesPerStream = bdhMemory.rawBytes / batchSize;
  const maxStreamsBdh = Math.floor((80 * 1024 * 1024 * 1024) / bdhStateBytesPerStream);

  return (
    <div className="space-y-6">
      {/* Top Banner: Real comparison readout */}
      <div className="p-4 rounded-lg bg-white border border-stone-300 shadow-sm flex flex-col sm:flex-row items-baseline justify-between gap-2">
        <div>
          <div className="font-mono text-xs uppercase text-stone-500 font-bold">
            Footprint Gap @ {seqLen.toLocaleString()} Tokens
          </div>
          <div className="font-serif text-xl font-bold text-stone-900 mt-0.5">
            BDH requires <span className="text-accent-olive font-mono">{reductionFactor.toLocaleString()}× less state memory</span> than Transformer.
          </div>
        </div>
        <div className="font-handwriting text-lg text-accent-terracotta">
          Hardware reference: 1× NVIDIA A100 (80 GB)
        </div>
      </div>

      {/* Dual Column instrument readouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transformer Box */}
        <div className={`p-6 rounded-xl border transition-all ${
          transformerMemory.oomStatus === 'OOM_CRITICAL'
            ? 'bg-rose-50/70 border-rose-400'
            : transformerMemory.oomStatus === 'WARNING'
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-stone-300'
        }`}>
          <div className="flex justify-between items-baseline pb-2 border-b border-stone-200">
            <span className="font-serif font-bold text-base text-stone-900">
              {transformer.name}
            </span>
            <span className="font-mono text-xs uppercase font-bold text-accent-terracotta">
              O(N) Unbounded Tape
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs font-mono text-stone-500 uppercase">KV Cache Memory Footprint:</div>
            <div className="font-mono text-4xl font-bold text-stone-900 mt-1">
              {transformerMemory.gigabytes >= 1
                ? `${transformerMemory.gigabytes.toFixed(1)} GB`
                : `${transformerMemory.megabytes.toFixed(0)} MB`}
            </div>
            <div className="text-xs text-stone-600 mt-1">
              Linear allocation across {batchSize} stream{batchSize > 1 ? 's' : ''}
            </div>
          </div>

          {/* VRAM Progress */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs font-mono text-stone-600">
              <span>80GB GPU Usage</span>
              <span className="font-bold">{transformerMemory.vramPercentageOfA100_80GB.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  transformerMemory.oomStatus === 'OOM_CRITICAL'
                    ? 'bg-rose-600'
                    : transformerMemory.oomStatus === 'WARNING'
                    ? 'bg-amber-600'
                    : 'bg-stone-800'
                }`}
                style={{ width: `${Math.min(100, transformerMemory.vramPercentageOfA100_80GB)}%` }}
              />
            </div>
          </div>

          {/* Status Message */}
          {transformerMemory.oomStatus === 'OOM_CRITICAL' ? (
            <div className="p-3 rounded bg-rose-100/80 border border-rose-300 text-rose-900 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <strong>CUDA Out-of-Memory Crash!</strong> Total KV cache exceeds 80 GB. System must abort or offload to slow host CPU RAM.
              </div>
            </div>
          ) : transformerMemory.oomStatus === 'WARNING' ? (
            <div className="p-3 rounded bg-amber-100/80 border border-amber-300 text-amber-900 text-xs">
              <strong>High VRAM Pressure:</strong> Over 40% of GPU memory is monopolized by the KV cache.
            </div>
          ) : (
            <div className="p-2.5 rounded bg-[#F4F2EB] border border-stone-200 text-xs font-mono text-stone-600">
              ✓ Fits within single 80GB card at current batch size
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-2 gap-2 text-xs font-mono text-stone-600">
            <div>
              <span className="block text-[10px] uppercase text-stone-500">Bytes per token</span>
              <span className="font-bold text-stone-800">
                {((transformerMemory.bytesPerToken || 0) / 1024).toFixed(1)} KB / token
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-stone-500">Max Concurrent Streams</span>
              <span className="font-bold text-stone-800">
                {maxStreamsTransformer} stream{maxStreamsTransformer !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* BDH Box */}
        <div className="p-6 rounded-xl border border-stone-300 bg-white">
          <div className="flex justify-between items-baseline pb-2 border-b border-stone-200">
            <span className="font-serif font-bold text-base text-stone-900">
              {bdh.name}
            </span>
            <span className="font-mono text-xs uppercase font-bold text-accent-olive">
              O(1) Constant State
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs font-mono text-stone-500 uppercase">Synaptic State Allocation:</div>
            <div className="font-mono text-4xl font-bold text-accent-olive mt-1">
              {bdhMemory.megabytes.toFixed(2)} MB
            </div>
            <div className="text-xs text-stone-600 mt-1">
              Constant footprint across {batchSize} stream{batchSize > 1 ? 's' : ''}
            </div>
          </div>

          {/* VRAM Progress */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between text-xs font-mono text-stone-600">
              <span>80GB GPU Usage</span>
              <span className="font-bold">{bdhMemory.vramPercentageOfA100_80GB.toFixed(3)}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded h-2.5 overflow-hidden">
              <div className="h-full bg-accent-olive" style={{ width: '1%' }} />
            </div>
          </div>

          <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2">
            <Check className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>Strictly Constant Geometry:</strong> Tokens rewire existing synapses in place. Zero new memory allocated whether processing 500 or 5,000,000 tokens.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-2 gap-2 text-xs font-mono text-stone-600">
            <div>
              <span className="block text-[10px] uppercase text-stone-500">Bytes per token</span>
              <span className="font-bold text-accent-olive">0.0 Bytes (In-Place)</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase text-stone-500">Max Concurrent Streams</span>
              <span className="font-bold text-accent-olive">
                {maxStreamsBdh.toLocaleString()} streams
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
