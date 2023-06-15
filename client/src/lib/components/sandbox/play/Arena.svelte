<script lang="ts">
  import ArenaCanvas from '../arena/ArenaCanvas.svelte';
  import ArenaLegend from '../arena/ArenaLegend.svelte';

  export let game: Game;

  const legendConfig = {
    colors: ['pink', 'lightblue']
  };

  const playerPublicKeys = (game.gamePlayers || []).map((p) => p.player.minaPublicKey) || ['', ''];

  export let rerender: () => {};
</script>

<div class="flex">
  <ArenaCanvas
    game={game}
    playerPublicKeys={playerPublicKeys}
    playerColors={legendConfig.colors}
    rerender={rerender}
  />
  <ArenaLegend
    playerPublicKeys={playerPublicKeys}
    playerColors={legendConfig.colors}
  />
</div>
