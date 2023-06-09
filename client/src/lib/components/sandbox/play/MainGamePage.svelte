<script lang="ts">
	import { onMount } from 'svelte';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { page } from '$app/stores';

	import PhaseInput from './phase-input/PhaseInput.svelte';
	import Arena from './Arena.svelte';
	import { truncateMinaPublicKey } from '$lib/utils';

	let currentGame: Game = { id: Number($page.params.gameId) };
	const minaArenaClient = new MinaArenaClient();
	let loaded = false;

	onMount(async () => {
		currentGame = await minaArenaClient.getGame(currentGame.id);
		console.log(currentGame);
		loaded = true;
	});

	const currentPlayer = () => {
		return currentGame.currentPhase?.gamePlayer.player.minaPublicKey || '';
	};

	const rerender = async () => {
		currentGame = await minaArenaClient.getGame(currentGame.id);
	};
</script>

<div>
	{#if loaded}
		{#key currentGame}
			<div>It's your turn: {truncateMinaPublicKey(currentPlayer())}</div>
			<div>Phase: {currentGame.currentPhase.name}</div>
			<Arena game={currentGame} {rerender} />
		{/key}
	{/if}
</div>
