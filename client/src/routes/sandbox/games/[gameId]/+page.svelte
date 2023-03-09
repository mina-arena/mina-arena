<script lang="ts">
	import MainDraftPage from '$lib/components/sandbox/squad-selection/MainDraftPage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import Arena from '$lib/components/sandbox/play/Arena.svelte';

	const minaArenaClient = new MinaArenaClient();
	let currentGame: Game = { id: Number($page.params.gameId) };

	onMount(() => {
		refreshGame();
	});

	const startGame = async () => {
		const game: Game = await minaArenaClient.startGame(currentGame.id);
		currentGame = game;
	};

	const refreshGame = async () => {
		const game: Game = await minaArenaClient.getGame(currentGame.id);
		currentGame = game;
	};
</script>

{#if currentGame && currentGame.status}
	{#if currentGame.status == 'PENDING'}
		<MainDraftPage {startGame} />
	{:else if currentGame.status == 'IN_PROGRESS'}
		<Arena />
	{:else if currentGame.status == 'COMPLETED'}
		<div>This game is over... stats/recap?</div>
	{:else}
		<div>Problems with this game</div>
	{/if}
{/if}
