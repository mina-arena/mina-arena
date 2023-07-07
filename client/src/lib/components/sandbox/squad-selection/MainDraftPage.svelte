<script lang="ts">
	import { units } from '$lib/stores/sandbox/unitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import SquadSelection from '$lib/components/sandbox/squad-selection/SquadSelection.svelte';
	import { onMount } from 'svelte';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { page } from '$app/stores';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import { truncateMinaPublicKey } from '$lib/utils';

	let playerTurn = 1;
	const player1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
	const player2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';

	const gameId = $page.params.gameId;

	const maxPlayers = 2;
	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		if ($units.length === 0) {
			minaArenaClient.getUnits().then((resp) => {
				$units = resp;
			});
		}
	});

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
			<SquadSelection player={currentPlayer} />
			<button on:click={selectSquad} class="_button">Select Squad</button>
		{:else}
			<div>
				<h3>Squads</h3>
				<div class="grid grid-cols-2 gap-6mx-auto">
					<div class="col-span-1">
						<h4>Player 1</h4>
						<table class="mx-auto mt-[20px]">
							<tr class="[&>*]:px-[15px]">
								<th>Name</th>
								<th>Unit</th>
								<th>Cost</th>
							</tr>
							{#each $squads[player1].units as unit}
								<tr class="[&>*]:px-[15px]">
									<td>{unit.name}</td>
									<td>{unit.unit.name}</td>
									<td>{unit.unit.pointsCost}</td>
								</tr>
							{/each}
							{#each $squads[player1].playerUnits as playerUnit}
								<tr class="[&>*]:px-[15px]">
									<td>{playerUnit.name}</td>
									<td>{playerUnit.unit.name}</td>
									<td>{playerUnit.unit.pointsCost}</td>
								</tr>
							{/each}
						</table>
					</div>
					<div class="col-span-1">
						<h4>Player 2</h4>
						<table class="mx-auto mt-[20px]">
							<tr class="[&>*]:px-[15px]">
								<th>Name</th>
								<th>Unit</th>
								<th>Cost</th>
							</tr>
							{#each $squads[player2].units as unit}
								<tr class="[&>*]:px-[15px]">
									<td>{unit.name}</td>
									<td>{unit.unit.name}</td>
									<td>{unit.unit.pointsCost}</td>
								</tr>
							{/each}
							{#each $squads[player2].playerUnits as playerUnit}
								<tr class="[&>*]:px-[15px]">
									<td>{playerUnit.name}</td>
									<td>{playerUnit.unit.name}</td>
									<td>{playerUnit.unit.pointsCost}</td>
								</tr>
							{/each}
						</table>
					</div>
				</div>
			</div>
			<button class="_button mt-[30px]" on:click={startGame}>Complete Draft</button>
		{/if}
	</div>
</div>
