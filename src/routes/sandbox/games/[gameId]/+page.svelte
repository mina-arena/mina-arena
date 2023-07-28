<script lang="ts">
	import MainDraftPage from '$lib/components/sandbox/squad-selection/MainDraftPage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import MainGamePage from '$lib/components/sandbox/play/MainGamePage.svelte';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	const minaArenaClient = new MinaArenaClient();
	let currentGame: Game = { id: Number($page.params.gameId) } as Game;

	onMount(() => {
		refreshGame();
	});

	const startGame = async () => {
		try {
			const game: Game = await minaArenaClient.startGame(currentGame.id);
			currentGame = game;
		} catch (err) {
			$errorString = String(err);
		}
	};

	const refreshGame = async () => {
		try {
			const game: Game = await minaArenaClient.getGameStatus(currentGame.id);
			currentGame = game;
		} catch (err) {
			$errorString = String(err);
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
