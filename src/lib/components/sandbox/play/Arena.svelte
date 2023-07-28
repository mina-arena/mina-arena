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
	<div class="flex flex-col items-center bg-stone-400 max-w-[33vw] p-12 m-16 border-[16px] border-black rounded-[32px]" style="box-shadow: 0 0 60px #000">
		<h1 class="font-almendra-bold uppercase m-0">Turn 1</h1>
		<h2 class="font-almendra-bold uppercase text-3xl mt-2">Movement phase</h2>
		<ArenaLegend {playerPublicKeys} playerColors={legendConfig.colors} />
		<ArenaActionLog {game} {playerPublicKeys} playerColors={legendConfig.colors} />
	</div>
</div>
<div style="display: none;">
	<img
		id="arena-bg-img"
		src="/images/battlefield.jpg"
		width={game.arena.width}
		height={game.arena.height}
	/>
</div>
