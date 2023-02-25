<script lang="ts">
	import { squads } from '$lib/stores/sandbox/squadStore';
	import { onMount } from 'svelte';
	import Arena from '$lib/components/sandbox/play/Arena.svelte';

	let initSquads: Record<number, Array<Unit>>;

	onMount(async () => {
		console.log('here');
		initSquads = $squads;
		console.log(initSquads);
	});
</script>

<div>
	{#if initSquads && initSquads[1] && initSquads[2]}
		<h3>initSquads</h3>
		<div>Player 1: {initSquads[1].map((x) => JSON.stringify(x))}</div>
		<div>Player 2: {initSquads[2].map((x) => JSON.stringify(x))}</div>

		<Arena />
	{:else}
		No squads found baby, try <a href="/sandbox/new">new game</a>
	{/if}
</div>
