/**
 * Live Educational Toy Simulation of:
 * 1. Transformer Exact Softmax KV Cache lookup
 * 2. BDH Recurrent Associative Memory (Hebbian update: S_t = λ S_{t-1} + v_t * k_t^T)
 *
 * Demonstrates:
 * - Transformer maintains near-perfect recall regardless of context depth, but stores all N pairs.
 * - BDH maintains a fixed d x d matrix (O(1) memory), but suffers crosstalk/interference
 *   when sequence length N significantly exceeds state dimension d.
 */

export interface NeedleExperimentResult {
  sequenceLength: number;
  needleDepthFraction: number;
  needlePosition: number;
  stateDimension: number;
  transformerFidelity: number; // 0.0 to 1.0 (cosine similarity to ground truth)
  bdhFidelity: number;         // 0.0 to 1.0 (cosine similarity to ground truth)
  interferenceNoise: number;   // 1.0 - bdhFidelity
  explanation: string;
}

// Deterministic pseudo-random number generator (LCG) for reproducible runs
class PRNG {
  private seed: number;
  constructor(seed: number = 1337) {
    this.seed = seed;
  }
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
  gaussian(): number {
    let u = 0, v = 0;
    while (u === 0) u = this.next();
    while (v === 0) v = this.next();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }
}

function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function normalize(vec: number[]): number[] {
  const norm = Math.sqrt(dot(vec, vec));
  if (norm < 1e-12) return vec;
  return vec.map(x => x / norm);
}

function randomUnitVector(dim: number, prng: PRNG): number[] {
  const vec = Array.from({ length: dim }, () => prng.gaussian());
  return normalize(vec);
}

export function runNeedleExperiment(
  seqLen: number = 256,
  needleDepthFraction: number = 0.5,
  stateDim: number = 32,
  lambdaDecay: number = 0.999
): NeedleExperimentResult {
  const prng = new PRNG(42 + seqLen);
  const needleIdx = Math.min(seqLen - 1, Math.max(0, Math.floor(seqLen * needleDepthFraction)));

  // Generate N random key-value pairs
  const keys: number[][] = [];
  const values: number[][] = [];

  for (let i = 0; i < seqLen; i++) {
    keys.push(randomUnitVector(stateDim, prng));
    values.push(randomUnitVector(stateDim, prng));
  }

  const targetKey = keys[needleIdx];
  const targetVal = values[needleIdx];

  // -------------------------------------------------------------
  // 1. TRANSFORMER EXACT SOFTMAX ATTENTION
  // -------------------------------------------------------------
  const similarities: number[] = [];
  const tau = 1.0 / Math.sqrt(stateDim);
  let maxSim = -Infinity;

  for (let i = 0; i < seqLen; i++) {
    const s = dot(targetKey, keys[i]) / tau;
    similarities.push(s);
    if (s > maxSim) maxSim = s;
  }

  let sumExp = 0;
  const expSims = similarities.map(s => {
    const val = Math.exp(s - maxSim);
    sumExp += val;
    return val;
  });

  const attnWeights = expSims.map(e => e / (sumExp || 1));

  // Compute weighted sum of values
  const transformerOut = new Array(stateDim).fill(0);
  for (let i = 0; i < seqLen; i++) {
    const w = attnWeights[i];
    const val = values[i];
    for (let d = 0; d < stateDim; d++) {
      transformerOut[d] += w * val[d];
    }
  }

  const normalizedTransformer = normalize(transformerOut);
  const transformerFidelity = Math.max(0, Math.min(1, dot(normalizedTransformer, targetVal)));

  // -------------------------------------------------------------
  // 2. BDH RECURRENT ASSOCIATIVE STATE
  // Hebbian outer-product update: S_t = λ S_{t-1} + v_t k_t^T
  // -------------------------------------------------------------
  const S: number[][] = Array.from({ length: stateDim }, () => new Array(stateDim).fill(0));

  for (let t = 0; t < seqLen; t++) {
    const k = keys[t];
    const v = values[t];
    for (let r = 0; r < stateDim; r++) {
      for (let c = 0; c < stateDim; c++) {
        S[r][c] = S[r][c] * lambdaDecay + v[r] * k[c];
      }
    }
  }

  // Retrieval query: y = S * targetKey
  const bdhOut = new Array(stateDim).fill(0);
  for (let r = 0; r < stateDim; r++) {
    bdhOut[r] = dot(S[r], targetKey);
  }

  const normalizedBDH = normalize(bdhOut);
  const rawBdhFidelity = dot(normalizedBDH, targetVal);
  const bdhFidelity = Math.max(0, Math.min(1, rawBdhFidelity));
  const interferenceNoise = Math.max(0, 1.0 - bdhFidelity);

  let explanation = '';
  if (seqLen <= stateDim) {
    explanation = `Context length (${seqLen}) is below state dimension (${stateDim}). Recurrent capacity easily accommodates all keys without significant cross-talk.`;
  } else if (seqLen <= stateDim * 4) {
    explanation = `Context length (${seqLen}) exceeds state dimension (${stateDim}) by ${Math.round(seqLen / stateDim)}x. Noticeable associative interference reduces recall clarity.`;
  } else {
    explanation = `Context length (${seqLen}) heavily saturates the ${stateDim}x${stateDim} recurrent matrix (${Math.round(seqLen / stateDim)}x capacity limit). Information crosstalk creates high background noise.`;
  }

  return {
    sequenceLength: seqLen,
    needleDepthFraction,
    needlePosition: needleIdx,
    stateDimension: stateDim,
    transformerFidelity: Number(transformerFidelity.toFixed(4)),
    bdhFidelity: Number(bdhFidelity.toFixed(4)),
    interferenceNoise: Number(interferenceNoise.toFixed(4)),
    explanation,
  };
}
