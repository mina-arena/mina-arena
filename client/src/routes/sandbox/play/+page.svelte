<script lang="ts">
	import { squads } from '$lib/stores/sandbox/squadStore';
	import { onMount } from 'svelte';
	import Arena from '$lib/components/sandbox/play/Arena.svelte';

	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';

	let initSquads: Record<string, Squad>;
	const minaArenaClient = new MinaArenaClient();

	const player1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
	const player2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';

	onMount(async () => {
		console.log('here');
		initSquads = $squads;
		console.log(initSquads);
	});
</script>

<div>
	{#if initSquads && initSquads[player1] && initSquads[player2]}
		<h3>Squads</h3>
		<div>Player 1: {JSON.stringify($squads[player1])}</div>
		<div>Player 2: {JSON.stringify($squads[player2])}</div>

		<Arena />
	{:else}
		No squads found baby, try <a href="/sandbox/new">new game</a>
	{/if}
</div>
