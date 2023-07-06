<script lang="ts">
  import ArenaCanvas from '../arena/ArenaCanvas.svelte';
  import ArenaLegend from '../arena/ArenaLegend.svelte';
  import ArenaActionLog from '../arena/ArenaActionLog.svelte';

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
    playerColors={legendConfig.colors}
    rerender={rerender}
  />
  <table>
    <tr>
      <ArenaLegend
        playerPublicKeys={playerPublicKeys}
        playerColors={legendConfig.colors}
      />
    </tr>
    <tr>
      <ArenaActionLog
        game={game}
        playerPublicKeys={playerPublicKeys}
        playerColors={legendConfig.colors}
      />
    </tr>
  </table>
</div>
