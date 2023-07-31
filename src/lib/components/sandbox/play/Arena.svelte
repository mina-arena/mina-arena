<script lang="ts">
	import ArenaCanvas from '../arena/ArenaCanvas.svelte';
	import ArenaLegend from '../arena/ArenaLegend.svelte';
	import ArenaActionLog from '../arena/ArenaActionLog.svelte';

	export let game: Game;

	const legendConfig = {
		colors: ['#BD2104', '#003CB0']
	};

	const playerPublicKeys = (game.gamePlayers || []).map((p) => p.player.minaPublicKey) || ['', ''];

	export let rerender: () => {};
</script>

<div class="flex-grow flex bg-arena-landscape-blurred bg-cover">
	<ArenaCanvas {game} playerColors={legendConfig.colors} {rerender} />
	<div
		class="flex flex-col items-center max-w-[33vw]"
	>
		<div class="w-full pr-16">
			<div class="w-full px-12 py-8 bg-stone-700 text-center text-white rounded-br-2xl rounded-bl-2xl drop-shadow-lg">
				<h1 class="font-almendra-bold uppercase m-0">Turn {game.turnNumber}</h1>
				<h2 class="font-almendra-bold uppercase text-3xl mt-2">{game.currentPhase?.name} PHASE</h2>
			</div>
		</div>

		<ArenaLegend
			{playerPublicKeys}
			playerColors={legendConfig.colors}
			currentPlayer={game.currentPhase?.gamePlayer.player.minaPublicKey || ''}
		/>

		<div class="flex-grow flex w-full pr-16">
			<div class="w-full flex-grow flex flex-col action-log-scroll">
				<div class="scroll-top">&nbsp;</div>
				<ArenaActionLog {game} {playerPublicKeys} playerColors={legendConfig.colors} />
			</div>
		</div>
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
