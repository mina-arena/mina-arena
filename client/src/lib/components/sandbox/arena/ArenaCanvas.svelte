<script lang="ts">
  import ArenaCanvasMovementPhase from "./ArenaCanvasMovementPhase.svelte";
  import ArenaCanvasShootingPhase from "./ArenaCanvasShootingPhase.svelte";

  export let game: Game;
  export let playerColors: Array<string>;
  export let rerender: () => {};

</script>

{#if game.currentPhase?.name === 'MOVEMENT'}
  <ArenaCanvasMovementPhase
    game={game}
    playerColors={playerColors}
    rerender={rerender}
  />
{:else if game.currentPhase?.name === 'SHOOTING'}
  <ArenaCanvasShootingPhase
    game={game}
    playerColors={playerColors}
    rerender={rerender}
  />
{/if}
