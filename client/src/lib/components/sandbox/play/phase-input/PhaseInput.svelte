<script lang="ts">
	import MovementPhaseInput from './MovementPhaseInput.svelte';

	export let game: Game;
	export let currentPlayer: string;

	const currentPhase = () => {
		return game.currentPhase?.name || '';
	};
</script>

<div class="pb-10">
	<div>Current Phase: {currentPhase()}</div>
	{#if game.currentPhase?.name == 'MOVEMENT'}
		<MovementPhaseInput {game} {currentPlayer} />
	{/if}
</div>
