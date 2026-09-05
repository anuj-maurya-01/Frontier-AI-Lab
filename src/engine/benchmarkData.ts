// Static precomputed benchmark data from Python verification experiments
// Ensures 100% instantaneous, verifiable fallback

export interface BenchmarkPoint {
  seqLen: number;
  llama70bGb: number;
  llama8bGb: number;
  bdh1bGb: number;
  bdh150mGb: number;
}

export const MEMORY_SCALING_TABLE: BenchmarkPoint[] = [
  { seqLen: 512, llama70bGb: 0.1563, llama8bGb: 0.0625, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 1024, llama70bGb: 0.3125, llama8bGb: 0.125, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 2048, llama70bGb: 0.625, llama8bGb: 0.25, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 4096, llama70bGb: 1.25, llama8bGb: 0.5, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 8192, llama70bGb: 2.5, llama8bGb: 1.0, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 16384, llama70bGb: 5.0, llama8bGb: 2.0, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 32768, llama70bGb: 10.0, llama8bGb: 4.0, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 65536, llama70bGb: 20.0, llama8bGb: 8.0, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
  { seqLen: 131072, llama70bGb: 40.0, llama8bGb: 16.0, bdh1bGb: 0.0156, bdh150mGb: 0.002 },
];

export interface NeedleRetrievalPoint {
  seqLen: number;
  transformerRecall: number;
  bdhRecall: number;
  interferenceNoise: number;
}

export const NEEDLE_RETRIEVAL_BENCHMARKS: NeedleRetrievalPoint[] = [
  { seqLen: 100, transformerRecall: 0.999, bdhRecall: 0.942, interferenceNoise: 0.058 },
  { seqLen: 250, transformerRecall: 0.998, bdhRecall: 0.825, interferenceNoise: 0.175 },
  { seqLen: 500, transformerRecall: 0.997, bdhRecall: 0.671, interferenceNoise: 0.329 },
  { seqLen: 1000, transformerRecall: 0.996, bdhRecall: 0.485, interferenceNoise: 0.515 },
  { seqLen: 2000, transformerRecall: 0.994, bdhRecall: 0.342, interferenceNoise: 0.658 },
  { seqLen: 4000, transformerRecall: 0.991, bdhRecall: 0.228, interferenceNoise: 0.772 },
];
