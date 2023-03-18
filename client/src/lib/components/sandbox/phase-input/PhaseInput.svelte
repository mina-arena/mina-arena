<script lang="ts">
	import MovementPhaseInput from './MovementPhaseInput.svelte';

	export let game: Game;
</script>

<div>
	{#if game.currentPhase?.name == 'MOVEMENT'}
		<MovementPhaseInput {game} />
	{/if}
</div>
