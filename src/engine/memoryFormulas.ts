export interface ModelArchitecture {
  id: string;
  name: string;
  type: 'transformer' | 'bdh';
  parameterCount: string;
  layers: number;
  qHeads?: number;
  kvHeads?: number;
  headDim?: number;
  stateDim?: number;
  description: string;
}

export const ARCHITECTURE_PRESETS: Record<string, ModelArchitecture> = {
  'llama3-8b': {
    id: 'llama3-8b',
    name: 'Llama-3 (8B)',
    type: 'transformer',
    parameterCount: '8 Billion',
    layers: 32,
    qHeads: 32,
    kvHeads: 8, // Grouped Query Attention (GQA)
    headDim: 128,
    description: 'Modern dense Transformer with GQA (8 KV heads across 32 query heads).'
  },
  'llama3-70b': {
    id: 'llama3-70b',
    name: 'Llama-3 (70B)',
    type: 'transformer',
    parameterCount: '70 Billion',
    layers: 80,
    qHeads: 64,
    kvHeads: 8,
    headDim: 128,
    description: 'Flagship open Transformer with 80 layers and 8 KV heads.'
  },
  'gpt2-xl': {
    id: 'gpt2-xl',
    name: 'GPT-2 XL (1.5B)',
    type: 'transformer',
    parameterCount: '1.5 Billion',
    layers: 48,
    qHeads: 25,
    kvHeads: 25, // Multi-Head Attention (MHA)
    headDim: 64,
    description: 'Classic Multi-Head Attention where every head maintains its own KV cache.'
  },
  'bdh-150m': {
    id: 'bdh-150m',
    name: 'Dragon Hatchling (BDH-CQ 150M)',
    type: 'bdh',
    parameterCount: '150 Million',
    layers: 16,
    stateDim: 256,
    description: 'Bio-inspired recurrent architecture with local Hebbian synaptic state matrix.'
  },
  'bdh-1b': {
    id: 'bdh-1b',
    name: 'Dragon Hatchling (BDH 1B)',
    type: 'bdh',
    parameterCount: '1 Billion',
    layers: 32,
    stateDim: 512,
    description: '1B parameter Dragon Hatchling with O(1) constant-shape synaptic memory.'
  }
};

export type PrecisionType = 'FP16' | 'INT8' | 'INT4';

export const PRECISION_BYTES: Record<PrecisionType, number> = {
  FP16: 2.0,
  INT8: 1.0,
  INT4: 0.5,
};

export interface MemoryResult {
  rawBytes: number;
  megabytes: number;
  gigabytes: number;
  complexity: 'O(N)' | 'O(1)';
  oomStatus: 'SAFE' | 'WARNING' | 'OOM_CRITICAL';
  vramPercentageOfA100_80GB: number;
  vramPercentageOfA100_40GB: number;
  vramPercentageOfRTX4090: number;
  bytesPerToken?: number;
}

export function calculateMemory(
  arch: ModelArchitecture,
  sequenceLength: number,
  batchSize: number = 1,
  precision: PrecisionType = 'FP16'
): MemoryResult {
  const bytesPerElem = PRECISION_BYTES[precision];
  let rawBytes = 0;
  let bytesPerToken = 0;

  if (arch.type === 'transformer') {
    // 2 (Key + Value) * layers * kvHeads * headDim * seqLen * batchSize * bytesPerElem
    const layers = arch.layers;
    const kvHeads = arch.kvHeads || 8;
    const headDim = arch.headDim || 128;
    
    // Per token size across all layers for 1 stream:
    bytesPerToken = 2 * layers * kvHeads * headDim * bytesPerElem;
    rawBytes = bytesPerToken * sequenceLength * batchSize;
  } else {
    // BDH: layers * (stateDim^2) * batchSize * bytesPerElem
    // Independent of sequence length N! O(1)
    const layers = arch.layers;
    const stateDim = arch.stateDim || 256;
    rawBytes = layers * (stateDim * stateDim) * batchSize * bytesPerElem;
    bytesPerToken = 0; // O(1) per token allocation
  }

  const megabytes = rawBytes / (1024 * 1024);
  const gigabytes = rawBytes / (1024 * 1024 * 1024);

  // Status against standard 80GB VRAM ceiling
  let oomStatus: 'SAFE' | 'WARNING' | 'OOM_CRITICAL' = 'SAFE';
  if (gigabytes > 80.0) {
    oomStatus = 'OOM_CRITICAL';
  } else if (gigabytes > 32.0) {
    oomStatus = 'WARNING';
  }

  return {
    rawBytes,
    megabytes: Number(megabytes.toFixed(2)),
    gigabytes: Number(gigabytes.toFixed(3)),
    complexity: arch.type === 'transformer' ? 'O(N)' : 'O(1)',
    oomStatus,
    vramPercentageOfA100_80GB: Math.min(100, (gigabytes / 80.0) * 100),
    vramPercentageOfA100_40GB: Math.min(100, (gigabytes / 40.0) * 100),
    vramPercentageOfRTX4090: Math.min(100, (gigabytes / 24.0) * 100),
    bytesPerToken,
  };
}
