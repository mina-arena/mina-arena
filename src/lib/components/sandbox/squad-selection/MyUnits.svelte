<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import MyUnitCard from './MyUnitCard.svelte';

	export let player: string;

	let selected = new Set<number>();

	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		minaArenaClient.getPlayerUnits(player).then((resp) => {
			$playerUnits[player] = resp;
		});
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

<div class="grid grid-cols-3 gap-4 mx-4">
	{#if $playerUnits[player]}
		{#if $squads && $squads[player]}
			{#each $playerUnits[player] as playerUnit}
				<MyUnitCard
					{playerUnit}
					{removeItem}
					{addItem}
					selected={!!$squads[player].playerUnits.find((pu) => pu.id === playerUnit.id)}
				/>
			{/each}
		{:else}
			{#each $playerUnits[player] as playerUnit}
				<MyUnitCard {playerUnit} viewOnly={true} />
			{/each}
		{/if}
	{/if}
</div>
