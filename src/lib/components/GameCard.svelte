<script>
  export let name
  export let description
  export let emoji
  export let color
  export let route
  export let played = false
  export let streak = 0
</script>

<a href={route} class="card card-hover block p-5 relative overflow-hidden" style="--game-color: {color}">
  <div class="absolute inset-0 opacity-5" style="background: radial-gradient(circle at top right, {color}, transparent 70%)"></div>

  <div class="relative">
    <div class="flex items-start justify-between mb-3">
      <span class="text-3xl">{emoji}</span>
      <div class="flex items-center gap-2">
        {#if streak > 0}
          <span class="tag" style="background: {color}22; color: {color}">🔥 {streak}</span>
        {/if}
        {#if played}
          <span class="tag bg-green-500/15 text-green-400">✓ Done</span>
        {/if}
      </div>
    </div>

    <h2 class="font-bold text-lg text-white mb-1">{name}</h2>
    <p class="text-sm text-slate-400 leading-snug">{description}</p>

    <div class="mt-4 flex items-center gap-1.5">
      <div class="h-0.5 flex-1 rounded-full" style="background: {color}40"></div>
      <span class="text-xs font-semibold" style="color: {color}">Play →</span>
    </div>
  </div>
</a>
