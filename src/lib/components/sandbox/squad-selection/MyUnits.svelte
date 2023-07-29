<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import MyUnitCard from './MyUnitCard.svelte';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	export let player: string;

	let selected = new Set<number>();
	let loadingPlayerUnits = true;

	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		try {
			minaArenaClient.getPlayerUnits(player).then((resp) => {
				$playerUnits[player] = resp;
				loadingPlayerUnits = false;
			});
		} catch (err) {
			$errorString = String(err);
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

{#if loadingPlayerUnits}
	<i class="fa fa-solid fa-refresh fa-spin"></i> Loading...
{:else}
	{#if $playerUnits[player] && $playerUnits[player].length > 0}
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
	{:else}
		<p class="col-span-6 mt-[40px]">
			No custom units, draft some using the Draft Units tab.
		</p>
	{/if}
{/if}
