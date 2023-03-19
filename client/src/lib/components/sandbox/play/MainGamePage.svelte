<script lang="ts">
	import { onMount } from 'svelte';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { page } from '$app/stores';

	import PhaseInput from './phase-input/PhaseInput.svelte';
	import Arena from './Arena.svelte';

	let currentGame: Game = { id: Number($page.params.gameId) };
	const minaArenaClient = new MinaArenaClient();
	let loaded = false;

	onMount(async () => {
		currentGame = await minaArenaClient.getGame(currentGame.id);
		console.log(currentGame);
		loaded = true;
	});

	const currentPlayer = () => {
		console.log('players:', currentGame.gamePlayers);
		const players = currentGame.turnPlayerOrder || [];
		if (players.length > 0) {
			if (currentGame.turnNumber == undefined) {
				throw new Error('No Turn Numnber');
			}
			const idx = currentGame.turnNumber - 1;
			return players[idx].player.minaPublicKey;
		}
		return '';
	};
</script>

<div>
	{#if loaded}
		<div>It's your turn: {currentPlayer()}</div>
		<PhaseInput game={currentGame} currentPlayer={currentPlayer()} />
		<Arena game={currentGame} />
	{/if}
</div>
