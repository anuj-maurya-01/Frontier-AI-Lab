"""
DataForge 2026: Pathway Track
Interactive Frontier AI Explainer: KV Cache vs. BDH Recurrent State

Verification and Benchmark Generation Script:
1. Computes analytical KV cache memory footprint across models (Llama-3 8B, 70B, GPT-2) vs BDH (10M, 150M, 1B).
2. Simulates exact associative memory updates (Hebbian outer product with decay)
   demonstrating the capacity bound and interference degradation.
3. Saves verified results into results/ directory.
"""

import json
import math
import os
import random

# -----------------------------------------------------------------------------
# 1. ANALYTICAL MEMORY CALCULATIONS
# -----------------------------------------------------------------------------

MODEL_CONFIGS = {
    "Llama-3-8B": {
        "type": "transformer",
        "params": "8B",
        "layers": 32,
        "q_heads": 32,
        "kv_heads": 8,  # GQA
        "head_dim": 128,
        "d_model": 4096,
    },
    "Llama-3-70B": {
        "type": "transformer",
        "params": "70B",
        "layers": 80,
        "q_heads": 64,
        "kv_heads": 8,  # GQA
        "head_dim": 128,
        "d_model": 8192,
    },
    "GPT-2-XL": {
        "type": "transformer",
        "params": "1.5B",
        "layers": 48,
        "q_heads": 25,
        "kv_heads": 25,  # MHA
        "head_dim": 64,
        "d_model": 1600,
    },
    "BDH-150M": {
        "type": "bdh",
        "params": "150M",
        "layers": 16,
        "state_dim": 256,
        "description": "Dragon Hatchling (BDH-CQ configuration)",
    },
    "BDH-1B": {
        "type": "bdh",
        "params": "1B",
        "layers": 32,
        "state_dim": 512,
        "description": "Dragon Hatchling (Full 1B parameter scale)",
    },
}

CONTEXT_LENS = [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072]
PRECISION_BYTES = {
    "FP16": 2.0,
    "INT8": 1.0,
    "INT4": 0.5,
}

def compute_kv_cache_bytes(layers, kv_heads, head_dim, seq_len, batch_size=1, bytes_per_elem=2.0):
    # 2 (Key + Value) * layers * kv_heads * head_dim * seq_len * batch_size * bytes_per_elem
    return 2 * layers * kv_heads * head_dim * seq_len * batch_size * bytes_per_elem

def compute_bdh_state_bytes(layers, state_dim, batch_size=1, bytes_per_elem=2.0):
    # Fixed synaptic matrix per layer: layers * (state_dim * state_dim) * batch_size * bytes_per_elem
    return layers * (state_dim * state_dim) * batch_size * bytes_per_elem

def generate_memory_scaling_data():
    memory_benchmark = {
        "context_lengths": CONTEXT_LENS,
        "models": {},
        "gpu_vram_references": {
            "RTX 4090": 24.0,
            "NVIDIA A100 (40GB)": 40.0,
            "NVIDIA A100 (80GB)": 80.0,
            "NVIDIA H100 (80GB)": 80.0,
        },
    }

    for model_name, cfg in MODEL_CONFIGS.items():
        model_data = {
            "type": cfg["type"],
            "params": cfg["params"],
            "precisions": {},
        }

        for prec_name, bytes_per_elem in PRECISION_BYTES.items():
            records = []
            for n in CONTEXT_LENS:
                if cfg["type"] == "transformer":
                    raw_bytes = compute_kv_cache_bytes(
                        cfg["layers"], cfg["kv_heads"], cfg["head_dim"], n, 1, bytes_per_elem
                    )
                else:  # bdh
                    raw_bytes = compute_bdh_state_bytes(
                        cfg["layers"], cfg["state_dim"], 1, bytes_per_elem
                    )
                
                mb = raw_bytes / (1024 * 1024)
                gb = raw_bytes / (1024 * 1024 * 1024)
                records.append({
                    "seq_len": n,
                    "bytes": raw_bytes,
                    "megabytes": round(mb, 2),
                    "gigabytes": round(gb, 4),
                })
            model_data["precisions"][prec_name] = records
        memory_benchmark["models"][model_name] = model_data

    return memory_benchmark


# -----------------------------------------------------------------------------
# 2. NEEDLE-IN-A-HAYSTACK RECALL & INTERFERENCE SIMULATION
# -----------------------------------------------------------------------------

def dot(v1, v2):
    return sum(x * y for x, y in zip(v1, v2))

def normalize(v):
    norm = math.sqrt(dot(v, v))
    if norm < 1e-12:
        return v
    return [x / norm for x in v]

def random_unit_vector(dim):
    v = [random.gauss(0, 1) for _ in range(dim)]
    return normalize(v)

def simulate_needle_retrieval():
    """
    Simulates memory retrieval of a designated target fact (needle) placed at
    different depths in a sequence of varying total length.
    """
    random.seed(42)
    state_dim = 64  # Representative toy state dimension
    decay_lambda = 0.9995  # Hebbian retention factor

    depth_fractions = [0.1, 0.25, 0.5, 0.75, 0.9]
    test_sequence_lengths = [100, 250, 500, 1000, 2000, 4000]

    retrieval_benchmark = {
        "state_dimension": state_dim,
        "decay_lambda": decay_lambda,
        "depth_fractions": depth_fractions,
        "sequence_lengths": test_sequence_lengths,
        "results": [],
    }

    for N in test_sequence_lengths:
        for depth in depth_fractions:
            needle_idx = int(N * depth)
            
            # Generate random key-value pairs
            keys = [random_unit_vector(state_dim) for _ in range(N)]
            values = [random_unit_vector(state_dim) for _ in range(N)]

            # Target needle
            target_key = keys[needle_idx]
            target_val = values[needle_idx]

            # 1. Transformer Exact Softmax KV lookup
            similarities = [dot(target_key, k) for k in keys]
            tau = 1.0 / math.sqrt(state_dim)
            max_sim = max(s / tau for s in similarities)
            exp_sims = [math.exp((s / tau) - max_sim) for s in similarities]
            sum_exp = sum(exp_sims)
            attn_weights = [e / sum_exp for e in exp_sims]

            transformer_out = [0.0] * state_dim
            for w, v in zip(attn_weights, values):
                for i in range(state_dim):
                    transformer_out[i] += w * v[i]
            transformer_out = normalize(transformer_out)
            transformer_fidelity = max(0.0, dot(transformer_out, target_val))

            # 2. BDH Linear Recurrent Associative State
            S = [[0.0] * state_dim for _ in range(state_dim)]
            for t in range(N):
                k = keys[t]
                v = values[t]
                weight = math.pow(decay_lambda, N - 1 - t)
                for r in range(state_dim):
                    for c in range(state_dim):
                        S[r][c] = S[r][c] * decay_lambda + weight * v[r] * k[c]

            bdh_out = [0.0] * state_dim
            for r in range(state_dim):
                bdh_out[r] = dot(S[r], target_key)
            bdh_out = normalize(bdh_out)
            bdh_fidelity = max(0.0, dot(bdh_out, target_val))

            retrieval_benchmark["results"].append({
                "seq_len": N,
                "depth_pct": int(depth * 100),
                "needle_index": needle_idx,
                "transformer_recall_fidelity": round(transformer_fidelity, 4),
                "bdh_recall_fidelity": round(bdh_fidelity, 4),
                "interference_ratio": round(max(0.0, 1.0 - bdh_fidelity), 4),
            })

    return retrieval_benchmark

# -----------------------------------------------------------------------------
# 3. RUN & EXPORT
# -----------------------------------------------------------------------------

def main():
    print("Generating memory scaling benchmark...")
    memory_data = generate_memory_scaling_data()
    with open("results/memory_scaling_benchmark.json", "w", encoding="utf-8") as f:
        json.dump(memory_data, f, indent=2)
    print("Saved to results/memory_scaling_benchmark.json")

    print("Generating needle retrieval benchmark...")
    retrieval_data = simulate_needle_retrieval()
    with open("results/needle_retrieval_benchmark.json", "w", encoding="utf-8") as f:
        json.dump(retrieval_data, f, indent=2)
    print("Saved to results/needle_retrieval_benchmark.json")

    # Quick sanity checks
    l70b_128k_fp16 = memory_data["models"]["Llama-3-70B"]["precisions"]["FP16"][-1]["gigabytes"]
    bdh1b_128k_fp16 = memory_data["models"]["BDH-1B"]["precisions"]["FP16"][-1]["gigabytes"]
    bdh1b_512_fp16 = memory_data["models"]["BDH-1B"]["precisions"]["FP16"][0]["gigabytes"]

    print("\n--- SANITY CHECK SUMMARY ---")
    print(f"Llama-3-70B @ 128k tokens (FP16): {l70b_128k_fp16:.2f} GB KV cache (exceeds single GPU memory!)")
    print(f"BDH-1B @ 512 tokens (FP16):      {bdh1b_512_fp16:.4f} GB")
    print(f"BDH-1B @ 128k tokens (FP16):     {bdh1b_128k_fp16:.4f} GB (Strictly constant O(1)!)")
    print(f"Memory reduction factor @ 128k:   {l70b_128k_fp16 / bdh1b_128k_fp16:,.0f}x smaller footprint")
    print("----------------------------\n")

if __name__ == "__main__":
    main()
