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

<div class="flex-grow flex bg-arena-landscape-blurred bg-cover">
	<ArenaCanvas {game} playerColors={legendConfig.colors} {rerender} />
	<div
		class="flex flex-col items-center bg-stone-300 max-w-[33vw] 2xl:max-w-[25vw] p-6 pt-9 m-16 border-[8px] border-stone-900 rounded-[32px]"
		style="box-shadow: 0 0 60px #000"
	>
		<h1 class="font-almendra-bold uppercase m-0">Turn {game.turnNumber}</h1>
		<h2 class="font-almendra-bold uppercase text-3xl mt-2">{game.currentPhase?.name} PHASE</h2>
		<ArenaLegend
			{playerPublicKeys}
			playerColors={legendConfig.colors}
			currentPlayer={game.currentPhase?.gamePlayer.player.minaPublicKey || ''}
		/>
		<ArenaActionLog {game} {playerPublicKeys} playerColors={legendConfig.colors} />
	</div>
</div>
<div style="display: none;">
	<img
		id="arena-bg-img"
		alt="arena-bg-img"
		src="/images/battlefield.jpg"
		width={game.arena.width}
		height={game.arena.height}
	/>
</div>
