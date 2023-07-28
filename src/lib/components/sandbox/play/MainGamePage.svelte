<script lang="ts">
	import { onMount } from 'svelte';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { page } from '$app/stores';

	import Arena from './Arena.svelte';
	import { truncateMinaPublicKey } from '$lib/utils';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	let gameId = Number($page.params.gameId);
	let currentGame: Game;
	const minaArenaClient = new MinaArenaClient();
	let loaded = false;

	onMount(async () => {
		try {
			currentGame = await minaArenaClient.getGame(gameId);
		} catch (err) {
			$errorString = String(err);
		}
		console.log(currentGame);
		loaded = true;
	});

	const currentPlayer = () => {
		return currentGame.currentPhase?.gamePlayer.player.minaPublicKey || '';
	};

	const rerender = async () => {
		try {
			currentGame = await minaArenaClient.getGame(currentGame.id);
		} catch (err) {
			$errorString = String(err);
		}
	};
</script>

<div class="w-[90%] mx-auto">
	{#if loaded}
		{#key currentGame}
			{#if currentGame.status === 'IN_PROGRESS'}
				<div>It's your turn: {truncateMinaPublicKey(currentPlayer())}</div>
				<div>Turn {currentGame.currentPhase?.turnNumber}</div>
				<div>Phase: {currentGame.currentPhase?.name}</div>
			{:else if currentGame.status === 'COMPLETED'}
				<div class="text-center">
					<h1 class="font-almendra-bold text-4xl my-12 uppercase">Game over!</h1>
					Winner: {currentGame.winningGamePlayer?.player.minaPublicKey}
				</div>
			{/if}
			<Arena game={currentGame} {rerender} />
		{/key}
	{/if}
</div>
