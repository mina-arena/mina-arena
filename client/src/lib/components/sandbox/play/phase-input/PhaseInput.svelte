<script lang="ts">
	import MovementPhaseInput from './MovementPhaseInput.svelte';

	export let game: Game;
	export let currentPlayer: string;
	export let rerender: () => {};

	const currentPhase = () => {
		return game.currentPhase?.name || '';
	};
</script>

<div class="pb-10">
	<div>
		Current Phase: {#key game}
			{currentPhase()}
		{/key}
	</div>
	{#if game.currentPhase?.name == 'MOVEMENT'}
		<MovementPhaseInput {game} {currentPlayer} {rerender} />
	{/if}
</div>
