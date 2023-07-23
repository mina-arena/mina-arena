<script lang="ts">
	import { units } from '$lib/stores/sandbox/unitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import SquadSelection from '$lib/components/sandbox/squad-selection/SquadSelection.svelte';
	import CompleteDraft from './CompleteDraft.svelte';
	import { onMount } from 'svelte';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { page } from '$app/stores';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import { truncateMinaPublicKey } from '$lib/utils';
	import { dummyPlayer, player1 as player1Store } from '$lib/stores/sandbox/playerStore';

	let playerTurn = 1;
	const player1 = $player1Store.publicKey;
	const player2 = $dummyPlayer.publicKey;

	const gameId = $page.params.gameId;

	const maxPlayers = 2;
	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		if ($units.length === 0) {
			minaArenaClient.getUnits().then((resp) => {
				$units = resp;
			});
		}
		resetSquad(player1);
		resetSquad(player2);
	});

	const resetSquad = (playerKey: string) => {
		$squads[playerKey] = { units: [], playerUnits: [] };
	}

	const resetSquadForCurrentPlayer = () => {
		resetSquad(currentPlayer);
	}

	const selectSquad = async () => {
		if (currentPlayer === player1) {
			await minaArenaClient.createGamePieces(player1, $squads[player1], Number(gameId));
			playerTurn++;
			currentPlayer = player2;
			updatePlayerUnits();
		} else {
			await minaArenaClient.createGamePieces(player2, $squads[player2], Number(gameId));
			playerTurn++;
		}
	};

	const updatePlayerUnits = () => {
		$playerUnits[currentPlayer] = [];
		minaArenaClient.getPlayerUnits(currentPlayer).then((resp) => {
			$playerUnits[currentPlayer] = resp;
		});
	};

	export let startGame: () => {};

	let currentPlayer = player1;
</script>

<div class="text-center">
	<h2 class="text-2xl font-semibold mb-10">Sandbox Mode</h2>
	<div>
		{#if playerTurn <= maxPlayers}
			<h3 class="text-xl">Select your squad</h3>
			<p>Drafting for {truncateMinaPublicKey(currentPlayer)}</p>
			<SquadSelection player={currentPlayer} {selectSquad} resetSquad={resetSquadForCurrentPlayer} />
		{:else}
			<CompleteDraft startGame={startGame} />
		{/if}
	</div>
</div>
