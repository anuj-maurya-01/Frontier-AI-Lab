# Presentation Guide & Live Demo Script

**Project:** Frontier AI Lab — KV Cache Bottlenecks vs. Dragon Hatchling (BDH)  
**Track:** DataForge 2026 — Pathway Track ("Explain the Frontier")  
**Target Time:** 3 to 5 minutes  
**Format:** Live Screen Share / Demo + Presentation

---

## ⏱️ Quick Pitch Outline (5-Minute Target)

| Segment | Duration | Focus | Visual Action |
| :--- | :--- | :--- | :--- |
| **1. The Hook & The Mystery** | 0:45 | Why a frozen 140GB model crashes on long PDFs | Show Hero section & slide to 64k tokens |
| **2. The Mechanical Culprit** | 1:00 | The KV cache tax & why we can't factor softmax | Point to grocery receipt analogy & math tab |
| **3. What Pathway Did (BDH)** | 1:00 | Synaptic rewiring in place ($O(1)$ memory) | Show live synaptic heatmap vs memory tape |
| **4. The Needle Test & The Catch** | 1:15 | Honest evaluation: rank bounds & interference | Switch to "Needle Recall Test" & show noise |
| **5. Conclusion & The Future** | 0:45 | Hybrids & ARC-AGI-1 results in BDH-CQ | Show Key Takeaways & close |

---

## 🎙️ Word-for-Word Spoken Script

### 1. The Hook (0:00 – 0:45)
> *"Hello judges. If you’ve ever tried to run a 70-billion parameter model like Llama-3 on a long legal contract or a book, you’ve probably run into a frustrating crash:* **`CUDA Out of Memory`**.*
>
> *Here is the strange thing about that crash: the model weights didn't grow by a single byte. We didn't add layers. The model wasn't learning.*
>
> *So what ate 80 gigabytes of VRAM?*
>
> *The culprit is the **KV Cache**—an engineering compromise baked into the heart of the Transformer. In this project, we built an interactive explainer to test a core question:* **What happens when you swap the expanding KV cache for biologically inspired synapses?**"

### 2. The Dilemma & The Demo (0:45 – 1:45)
*[Action: Move the context length slider to 64,000 words on the hero bench]*

> *"Let me show you the problem live on our experimental bench.*
>
> *Notice what happens when I drag this sequence slider past 64,000 tokens. For Llama-3 70B, holding the past conversation history for just 2 users consumes **80 gigabytes of memory**. The GPU crashes.*
>
> *Why does this happen? Because in autoregressive generation, word number 5,001 must compute an attention score against all 5,000 previous words. If you don't save those words, you have to rerun the whole model from scratch on every step—taking minutes per token.*
>
> *Engineers solved this by caching every key and value vector into GPU memory. Think of it like grocery shopping with a receipt you can never tear off: by aisle 12, the paper receipt trailing behind you is four miles long."*

### 3. What Pathway Did in Dragon Hatchling (1:45 – 2:45)
*[Action: Scroll to the comparison view and highlight the BDH 16 MB flatline]*

> *"Now look at the right side of the screen:* **Dragon Hatchling (BDH)**, *published by Adrian Kosowski and researchers at Pathway in September 2025.*
>
> *At 512 tokens, BDH consumes 16 megabytes of state memory. At 64,000 tokens, it still consumes **16 megabytes**. At 128,000 tokens, it is still **16 megabytes**. That is a **$2,500\times$ memory reduction**.*
>
> *How does it do this? Instead of appending tokens to an external memory tape, BDH treats the network like interacting neuron particles. When a new word arrives, it updates a fixed $d \times d$ synaptic matrix in place using local Hebbian plasticity—the biological principle that 'neurons that fire together, wire together'. The memory matrix never expands."*

### 4. The Needle Test & The Catch (2:45 – 4:00)
*[Action: Switch to the 'Needle Recall Test' tab]*

> *"Now, as engineers, we know there is no free lunch in computer science. If BDH uses so little memory, what is the catch?*
>
> *To test this, we built a live **Needle-in-a-Haystack test** running live linear associative memory directly in the browser.*
>
> *Here, we insert a secret fact at 50% depth in the document:*
> * *In a **Transformer**, every word has its own memory slot. It can extract the needle with near **100% precision**—at the cost of unbounded VRAM.*
> * *In **Dragon Hatchling**, memories are superimposed into a single matrix. By linear algebra, a matrix of size $d$ has rank at most $d$. When sequence length $N$ exceeds $d$, the vectors can no longer be orthogonal. Memories begin to superimpose, creating background interference noise.*
>
> *This confirms our central claim: BDH gives you strict $O(1)$ memory, but you pay with bounded capacity over extreme horizons."*

### 5. Conclusion & The Future (4:00 – 4:45)
*[Action: Scroll to the Key Takeaways section]*

> *"So where does the field go from here?*
>
> *First, in August 2026, Pathway published **BDH-CQ**, showing that persistent latent recurrence can solve complex reasoning tasks on ARC-AGI-1 at just **$0.0007 per task**, without vomiting thousands of verbose thinking tokens into the KV cache.*
>
> *Second, the winning future architecture will almost certainly be **hybrid**: combining a short local attention window for exact syntax with a recurrent biological synaptic state for unbounded global context.*
>
> *Our explainer runs completely client-side with verified mathematical formulas. Thank you, and we look forward to your questions."*

---

## 🖥️ Screen-by-Screen Live Demo Checklist

1. **Before the presentation:**
   - Open `http://localhost:4173/` in your browser.
   - Zoom to 100% (or 110% if presenting on a projector).
   - Ensure the slider is reset to default (32k tokens).

2. **At 0:45 (The Crash):**
   - Grab the Context Slider in the Hero section and drag it smoothly from `4k` up to `64k` and `128k`.
   - Pause when the red alert appears: `"CUDA Out-of-Memory! Server dead."`

3. **At 1:45 (The Tape vs Matrix):**
   - Scroll down to the Interactive Experimental Bench.
   - Click the **"Stream"** button on the Transformer Memory Tape to show the blocks filling up.
   - Click the **"Update"** button on the BDH Synaptic State to show the synapses pulsing in place without allocating new blocks.

4. **At 2:45 (The Needle Test):**
   - Click the **"Needle Recall Test"** toggle button.
   - Adjust the sequence length from 250 to 1,500 words to show the BDH recall fidelity naturally dipping from 94% to 48% due to interference noise, while Transformer stays at ~99%.
   - Explain that this proves the **rank bound**.

5. **At 4:00 (Takeaways):**
   - Scroll down to the 3 Key Takeaways and conclude.
