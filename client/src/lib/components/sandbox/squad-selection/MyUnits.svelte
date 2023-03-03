<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';

	const minaArenaClient = new MinaArenaClient();
	onMount(() => {
		if ($playerUnits.length === 0) {
			minaArenaClient.getPlayerUnits().then((resp) => {
				$playerUnits = resp;
			});
		}
	});
</script>

<div class="grid grid-cols-5 gap-6 w-3/4">
	{#each $playerUnits as playerUnit}
		<div class="border border-slate-300 rounded py-6 col-span-1">
			<p>{playerUnit.name}</p>
			<p>unit: {playerUnit.unit?.name}</p>
		</div>
	{/each}
</div>
