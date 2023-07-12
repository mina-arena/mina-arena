<script lang="ts">
	import ArenaCanvasMovementPhase from './arena-phases/ArenaCanvasMovementPhase.svelte';
	import ArenaCanvasShootingPhase from './arena-phases/ArenaCanvasShootingPhase.svelte';
	import ArenaCanvasMeleePhase from './arena-phases/ArenaCanvasMeleePhase.svelte';

	export let game: Game;
	export let playerColors: Array<string>;
	export let rerender: () => {};
</script>

{#if game.currentPhase?.name === 'MOVEMENT'}
	<ArenaCanvasMovementPhase {game} {playerColors} {rerender} />
{:else if game.currentPhase?.name === 'SHOOTING'}
	<ArenaCanvasShootingPhase {game} {playerColors} {rerender} />
{:else if game.currentPhase?.name === 'MELEE'}
	<ArenaCanvasMeleePhase {game} {playerColors} {rerender} />
{/if}
