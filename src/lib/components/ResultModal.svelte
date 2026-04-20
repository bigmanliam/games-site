<script>
  export let won
  export let answer
  export let shareText
  export let color = '#6366f1'
  export let onClose = () => {}

  let copied = false

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareText)
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch {
      // fallback: select a hidden textarea
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" on:click|self={onClose}>
  <div class="card w-full max-w-sm p-6 animate-slide-up" style="border-color: {won ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.2)'}">

    <div class="text-center mb-5">
      <div class="text-5xl mb-3">{won ? '🎉' : '😔'}</div>
      <h2 class="text-xl font-bold text-white mb-1">{won ? 'Nice work!' : 'Better luck tomorrow'}</h2>
      {#if !won}
        <p class="text-sm text-slate-400">The answer was <span class="font-semibold text-white">{answer}</span></p>
      {/if}
    </div>

    <div class="bg-white/5 rounded-xl p-4 mb-4 font-mono text-sm text-slate-300 whitespace-pre-line leading-relaxed">
      {shareText}
    </div>

    <div class="flex gap-3">
      <button class="btn btn-ghost flex-1" on:click={onClose}>Close</button>
      <button
        class="btn flex-1 text-white transition-all"
        style="background: {color}"
        on:click={copyShare}
      >
        {copied ? '✓ Copied!' : '📋 Share'}
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-slide-up {
    animation: slide-up 0.25s ease-out;
  }
</style>
