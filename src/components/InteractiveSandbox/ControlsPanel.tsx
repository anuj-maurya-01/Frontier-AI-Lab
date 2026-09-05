import React from 'react';
import { RotateCcw } from 'lucide-react';
import { PrecisionType } from '../../engine/memoryFormulas';

interface ControlsPanelProps {
  seqLen: number;
  onSeqLenChange: (val: number) => void;
  batchSize: number;
  onBatchSizeChange: (val: number) => void;
  precision: PrecisionType;
  onPrecisionChange: (val: PrecisionType) => void;
  selectedTransformerId: string;
  onTransformerChange: (id: string) => void;
  selectedBdhId: string;
  onBdhChange: (id: string) => void;
  onReset: () => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  seqLen,
  onSeqLenChange,
  batchSize,
  onBatchSizeChange,
  precision,
  onPrecisionChange,
  selectedTransformerId,
  onTransformerChange,
  selectedBdhId,
  onBdhChange,
  onReset,
}) => {
  return (
    <div className="bg-white border border-stone-300 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <span className="font-serif font-bold text-sm text-stone-900">
          Dial In Context
        </span>
        <button
          onClick={onReset}
          className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1 transition-colors px-2 py-0.5 rounded border border-stone-200 hover:bg-stone-50 font-sans"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Context Length Slider */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-xs font-mono font-semibold text-stone-700">
            Context Length (N)
          </label>
          <span className="font-mono text-xs font-bold text-stone-900 bg-[#F4F2EB] px-2 py-0.5 rounded border border-stone-200">
            {seqLen.toLocaleString()} tokens
          </span>
        </div>

        <input
          type="range"
          min={1024}
          max={131072}
          step={2048}
          value={seqLen}
          onChange={(e) => onSeqLenChange(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded appearance-none cursor-pointer accent-stone-900"
        />
        <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-1">
          <span>1k</span>
          <span>32k</span>
          <span>64k</span>
          <span>128k</span>
        </div>
      </div>

      {/* 2. Batch Size */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <label className="text-xs font-mono font-semibold text-stone-700">
            Concurrent Streams (B)
          </label>
          <span className="font-mono text-xs text-stone-600">
            {batchSize} user{batchSize > 1 ? 's' : ''}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 4, 8, 16].map((b) => (
            <button
              key={b}
              onClick={() => onBatchSizeChange(b)}
              className={`py-1 text-xs font-mono rounded border transition-all ${
                batchSize === b
                  ? 'bg-stone-900 text-white border-stone-900 font-semibold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {b}x
            </button>
          ))}
        </div>
      </div>

      {/* 3. Model Selectors */}
      <div className="pt-3 border-t border-stone-200 space-y-3">
        <div>
          <label className="text-[11px] font-mono font-medium text-stone-600 block mb-1">
            Compare Transformer:
          </label>
          <select
            value={selectedTransformerId}
            onChange={(e) => onTransformerChange(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-stone-300 text-stone-800 text-xs rounded p-2 focus:outline-none focus:border-stone-800 font-sans"
          >
            <option value="llama3-70b">Llama-3 (70B, 80 layers)</option>
            <option value="llama3-8b">Llama-3 (8B, 32 layers)</option>
            <option value="gpt2-xl">GPT-2 XL (1.5B)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-mono font-medium text-stone-600 block mb-1">
            Against Dragon Hatchling:
          </label>
          <select
            value={selectedBdhId}
            onChange={(e) => onBdhChange(e.target.value)}
            className="w-full bg-[#FAF9F5] border border-stone-300 text-stone-800 text-xs rounded p-2 focus:outline-none focus:border-stone-800 font-sans"
          >
            <option value="bdh-1b">Dragon Hatchling (BDH 1B, dim=512)</option>
            <option value="bdh-150m">Dragon Hatchling (BDH-CQ 150M, dim=256)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
