<script lang="ts">
	import ArenaCanvas from '../arena/ArenaCanvas.svelte';
	import ArenaLegend from '../arena/ArenaLegend.svelte';
	import ArenaActionLog from '../arena/ArenaActionLog.svelte';

	export let game: Game;

	const legendConfig = {
		colors: ['#EF626C', '#84DCCF']
	};

	const playerPublicKeys = (game.gamePlayers || []).map((p) => p.player.minaPublicKey) || ['', ''];

	export let rerender: () => {};
</script>

<div class="flex justify-between">
	<ArenaCanvas {game} playerColors={legendConfig.colors} {rerender} />
	<table>
		<tr>
			<ArenaLegend {playerPublicKeys} playerColors={legendConfig.colors} />
		</tr>
		<tr>
			<ArenaActionLog {game} {playerPublicKeys} playerColors={legendConfig.colors} />
		</tr>
	</table>
</div>
<div style="display: none;">
	<img
		id="arena-bg-img"
		src="/images/battlefield_dirt_650x550.png"
		width={game.arena.width}
		height={game.arena.height}
	/>
</div>
