<script lang="ts">
	import { units } from '$lib/stores/sandbox/unitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import SquadSelection from '$lib/components/sandbox/squad-selection/SquadSelection.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';

	let playerTurn = 1;
	const player1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
	const player2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';

	const maxPlayers = 2;
	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		if ($units.length === 0) {
			minaArenaClient.getUnits().then((resp) => {
				$units = resp;
			});
		}
	});

	const selectSquad = () => {
		if (currentPlayer === player1) {
			minaArenaClient.createGamePieces(player1, $squads[player1]);
			playerTurn++;
			currentPlayer = player2;
		} else {
			minaArenaClient.createGamePieces(player2, $squads[player2]);
		}
	};

	const startGame = () => {
		goto('/sandbox/play');
	};

	let currentPlayer = player1;
</script>

<div class="text-center">
	<h2 class="text-2xl font-semibold mb-10">Sandbox Mode</h2>
	<div>
		{#if playerTurn <= maxPlayers}
			<h3 class="text-xl">Select your squad</h3>
			<p>Drafting for {currentPlayer}</p>
			<SquadSelection player={currentPlayer} />
			<button on:click={selectSquad} class="border border-slate-400 p-5 rounded"
				>Select Squad</button
			>
		{:else}
			<div>
				<h3>Squads</h3>
				<div>Player 1: {JSON.stringify($squads[player1])}</div>
				<div>Player 2: {JSON.stringify($squads[player2])}</div>
			</div>
			<button class="border border-slate-400 p-5 rounded" on:click={startGame}>Start Game!</button>
		{/if}
	</div>
</div>
