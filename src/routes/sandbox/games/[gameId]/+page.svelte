<script lang="ts">
	import MainDraftPage from '$lib/components/sandbox/squad-selection/MainDraftPage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import MainGamePage from '$lib/components/sandbox/play/MainGamePage.svelte';
	import { error } from '$lib/stores/sandbox/errorsStore';
	import { player1, player2 } from '$lib/stores/sandbox/playerStore';

	const minaArenaClient = new MinaArenaClient();
	let currentGame: Game = { id: Number($page.params.gameId) };

	onMount(async () => {
		await refreshGame();
	});

	const startGame = async () => {
		try {
			const game: Game = await minaArenaClient.startGame(currentGame.id);
			currentGame = game;
		} catch (err) {
			$error = String(err);
		}
	};

	const refreshGame = async () => {
		try {
			const game: Game = await minaArenaClient.getGameStatus(currentGame.id);
			currentGame = game;
		} catch (err) {
			$error = String(err);
		}

		if ($player1.publicKey === '' || $player2.publicKey === '') {
			$error = 'Error: Not logged in.  Please generate a new keypair.';
		}

		const gamePlayers = currentGame.gamePlayers?.map((gp) => gp.player.minaPublicKey);

		if (gamePlayers) {
			if (!gamePlayers.includes($player1.publicKey) || !gamePlayers.includes($player2.publicKey)) {
				$error = 'Error: You are not logged in as a user of this game';
			}
		}
	};
</script>

{#if currentGame && currentGame.status}
	{#if currentGame.status == 'PENDING'}
		<MainDraftPage {startGame} />
	{:else if currentGame.status == 'IN_PROGRESS'}
		<MainGamePage />
	{:else if currentGame.status == 'COMPLETED'}
		<div>This game is over... stats/recap?</div>
	{:else}
		<div>Problems with this game</div>
	{/if}
{/if}
