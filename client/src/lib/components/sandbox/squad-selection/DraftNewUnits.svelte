<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { units } from '$lib/stores/sandbox/unitStore';

	const minaArenaClient = new MinaArenaClient();
	onMount(() => {
		if ($units.length === 0) {
			minaArenaClient.getUnits().then((resp) => {
				$units = resp;
			});
		}
	});
</script>

<div class="grid grid-cols-5 gap-6 w-3/4">
	{#each $units as unit}
		<div class="border border-slate-300 rounded py-6 col-span-1">
			<p>{unit.name}</p>
			<p>atk: {unit.attackPower}, arm: {unit.armor}</p>
			<p>Cost: {unit.attackPower + unit.armor + unit.maxHealth}</p>
		</div>
	{/each}
</div>
