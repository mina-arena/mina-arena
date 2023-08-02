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
	import { errorString } from '$lib/stores/sandbox/errorsStore';
	import {
		player2 as player2Store,
		player1 as player1Store
	} from '$lib/stores/sandbox/playerStore';

	let playerTurn = 1;
	const player1 = $player1Store.publicKey;
	const player2 = $player2Store.publicKey;

	const gameId = $page.params.gameId;

	const maxPlayers = 2;
	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		try {
			if ($units.length === 0) {
				minaArenaClient.getUnits().then((resp) => {
					$units = resp;
				});
			}
			resetSquad(player1);
			resetSquad(player2);
		} catch (err) {
			$errorString = String(err);
		}
	});

	const resetSquad = (playerKey: string) => {
		$squads[playerKey] = { units: [], playerUnits: [] };
	};

	const resetSquadForCurrentPlayer = () => {
		resetSquad(currentPlayer);
	};

	const selectSquad = async () => {
		try {
			if (currentPlayer === player1) {
				await minaArenaClient.createGamePieces(player1, $squads[player1], Number(gameId));
				playerTurn++;
				currentPlayer = player2;
				updatePlayerUnits();
			} else {
				await minaArenaClient.createGamePieces(player2, $squads[player2], Number(gameId));
				playerTurn++;
			}
		} catch (err) {
			$errorString = String(err);
		}
	};

	const updatePlayerUnits = () => {
		try {
			$playerUnits[currentPlayer] = [];
			minaArenaClient.getPlayerUnits(currentPlayer).then((resp) => {
				$playerUnits[currentPlayer] = resp;
			});
		} catch (err) {
			$errorString = String(err);
		}
	};

	export let startGame: () => {};

	let currentPlayer = player1;
</script>

<div
	class="flex-grow pt-12 bg-stone-700 bg-arena-landscape-blurred bg-cover bg-fixed text-center text-white"
>
	<h2 class="text-2xl uppercase text-standoff-shadow">Sandbox mode</h2>
	{#if playerTurn <= maxPlayers}
		<h1 class="font-almendra-bold text-4xl uppercase text-standoff-shadow">Select your squad</h1>
		<p class="text-standoff-shadow">Drafting for {truncateMinaPublicKey(currentPlayer)}</p>
		<SquadSelection player={currentPlayer} {selectSquad} resetSquad={resetSquadForCurrentPlayer} />
	{:else}
		<CompleteDraft {startGame} />
	{/if}
</div>
