<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';

	export let player: string;

	let selected = new Set<number>();

	const minaArenaClient = new MinaArenaClient();
	onMount(() => {
		if ($playerUnits.length === 0) {
			minaArenaClient.getPlayerUnits().then((resp) => {
				$playerUnits = resp;
			});
		}
	});

	const addItem = (playerUnit: PlayerUnit) => {
		selected.add(playerUnit.id);
		selected = selected;
		$squads[player].playerUnits.push(playerUnit);
		$squads[player] = $squads[player];
	};

	const removeItem = (playerUnit: PlayerUnit) => {
		selected.delete(playerUnit.id);
		selected = selected;
		const index = $squads[player].playerUnits.indexOf(playerUnit);
		console.log(index);
		if (index > -1) {
			$squads[player].playerUnits.splice(index, 1);
		}
		$squads[player] = $squads[player];
	};
</script>

<div class="grid grid-cols-5 gap-6 w-3/4">
	{#each $playerUnits as playerUnit}
		{#if selected.has(playerUnit.id)}
			<div
				on:click={() => removeItem(playerUnit)}
				on:keypress={() => removeItem(playerUnit)}
				class="border border-slate-300 rounded py-6 col-span-1 bg-slate-100"
			>
				<p>{playerUnit.name}</p>
				<p>unit: {playerUnit.unit?.name}</p>
			</div>
		{:else}
			<div
				on:click={() => addItem(playerUnit)}
				on:keypress={() => addItem(playerUnit)}
				class="border border-slate-300 rounded py-6 col-span-1"
			>
				<p>{playerUnit.name}</p>
				<p>unit: {playerUnit.unit?.name}</p>
			</div>
		{/if}
	{/each}
</div>
