<script lang="ts">
	import MovementPhaseInput from './MovementPhaseInput.svelte';
	import ShootingPhaseInput from './ShootingPhaseInput.svelte';
	import MeleePhaseInput from './MeleePhaseInput.svelte';

	export let game: Game;
	export let currentPlayer: string;
	export let rerender: () => {};

	const currentPhase = () => {
		return game.currentPhase?.name || '';
	};
</script>

<div class="pb-10">
	{#if game.currentPhase?.name == 'MELEE'}
		<div>
			Current Phase: {#key game}
				{currentPhase()}
			{/key}
		</div>
		<MeleePhaseInput {game} {currentPlayer} {rerender} />
	{/if}
</div>
