<script lang="ts">
	import { dummyUnits, units } from '$lib/stores/sandbox/unitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import SquadSelection from '$lib/components/sandbox/SquadSelection.svelte';

	let playerTurn = 1;
	let currentSquad: Set<Unit> = new Set();
	let totalCost = 0;
	const maxCost = 15;
	const maxPlayers = 2;

	const toggleUnitSelected = (unit: Unit) => {
		if (unit.selected) {
			currentSquad.delete(unit);
			totalCost -= unit.cost;
			unit.selected = !unit.selected;
		} else {
			if (totalCost + unit.cost <= maxCost) {
				currentSquad.add(unit);
				totalCost += unit.cost;
				unit.selected = !unit.selected;
			}
		}
		units.set($units);
		currentSquad = currentSquad;
	};

	const selectSquad = () => {
		$squads[playerTurn] = Array.from(currentSquad);
		currentSquad = new Set();
		totalCost = 0;
		units.set(dummyUnits());
		playerTurn++;
	};
</script>

<div class="text-center">
	<h2 class="text-2xl font-semibold mb-10">Sandbox Mode</h2>
	<div>
		{#if playerTurn <= maxPlayers}
			<h3 class="text-xl">Select your squad</h3>
			<p>Drafting for Player{playerTurn}</p>
			<div class="py-10 mb-10">
				<div class="grid grid-cols-5 gap-6mx-auto">
					<div class="col-span-1">Total Cost: {totalCost}</div>
					{#key currentSquad}
						<div class="col-span-4">Current Squad {Array.from(currentSquad).map((u) => u.id)}</div>
					{/key}
				</div>
			</div>
			<SquadSelection {toggleUnitSelected} />
			<button on:click={selectSquad} class="border border-slate-400 p-5 rounded"
				>Select Squad</button
			>
		{:else}
			<div>
				<h3>Squads</h3>
				<div>Player 1: {$squads[1].map((x) => JSON.stringify(x))}</div>
				<div>Player 2: {$squads[2].map((x) => JSON.stringify(x))}</div>
			</div>
			<button class="border border-slate-400 p-5 rounded">Start Game!</button>
		{/if}
	</div>
</div>
