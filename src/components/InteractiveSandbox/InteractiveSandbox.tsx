import React, { useState } from 'react';
import { ControlsPanel } from './ControlsPanel';
import { VRAMComparisonView } from './VRAMComparisonView';
import { KVMemoryGrid } from './KVMemoryGrid';
import { BDHStateMatrix } from './BDHStateMatrix';
import { RetrievalArena } from './RetrievalArena';
import { calculateMemory, ARCHITECTURE_PRESETS, PrecisionType } from '../../engine/memoryFormulas';

export const InteractiveSandbox: React.FC = () => {
  const [seqLen, setSeqLen] = useState<number>(32768);
  const [batchSize, setBatchSize] = useState<number>(2);
  const [precision, setPrecision] = useState<PrecisionType>('FP16');
  const [selectedTransformerId, setSelectedTransformerId] = useState<string>('llama3-70b');
  const [selectedBdhId, setSelectedBdhId] = useState<string>('bdh-1b');
  const [activeTab, setActiveTab] = useState<'vram' | 'retrieval'>('vram');

  const transformerArch = ARCHITECTURE_PRESETS[selectedTransformerId];
  const bdhArch = ARCHITECTURE_PRESETS[selectedBdhId];

  const transformerMemory = calculateMemory(transformerArch, seqLen, batchSize, precision);
  const bdhMemory = calculateMemory(bdhArch, seqLen, batchSize, precision);

  const handleReset = () => {
    setSeqLen(32768);
    setBatchSize(2);
    setPrecision('FP16');
    setSelectedTransformerId('llama3-70b');
    setSelectedBdhId('bdh-1b');
  };

  return (
    <section id="sandbox" className="py-14 border-b border-stone-200 bg-[#FAF9F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
              Interactive Experimental Bench
            </h2>
            <p className="text-stone-600 text-sm mt-0.5">
              Compare physical memory and fact recall between Transformers and Dragon Hatchling.
            </p>
          </div>

          {/* Simple 2-way toggle */}
          <div className="flex items-center space-x-1 p-1 rounded-lg bg-[#F4F2EB] border border-stone-300 self-start sm:self-auto font-sans text-xs">
            <button
              onClick={() => setActiveTab('vram')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'vram'
                  ? 'bg-white text-stone-900 font-bold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Memory & Hardware
            </button>
            <button
              onClick={() => setActiveTab('retrieval')}
              className={`px-3 py-1.5 rounded transition-all ${
                activeTab === 'retrieval'
                  ? 'bg-white text-stone-900 font-bold shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Needle Recall Test
            </button>
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-6">
          <ControlsPanel
            seqLen={seqLen}
            onSeqLenChange={setSeqLen}
            batchSize={batchSize}
            onBatchSizeChange={setBatchSize}
            precision={precision}
            onPrecisionChange={setPrecision}
            selectedTransformerId={selectedTransformerId}
            onTransformerChange={setSelectedTransformerId}
            selectedBdhId={selectedBdhId}
            onBdhChange={setSelectedBdhId}
            onReset={handleReset}
          />

          {activeTab === 'vram' ? (
            <div className="space-y-6">
              <VRAMComparisonView
                transformer={transformerArch}
                transformerMemory={transformerMemory}
                bdh={bdhArch}
                bdhMemory={bdhMemory}
                seqLen={seqLen}
                batchSize={batchSize}
              />

              {/* Physical memory tapes fused directly into the view */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KVMemoryGrid seqLen={seqLen} />
                <BDHStateMatrix seqLen={seqLen} />
              </div>
            </div>
          ) : (
            <RetrievalArena />
          )}
        </div>
      </div>
    </section>
  );
};
