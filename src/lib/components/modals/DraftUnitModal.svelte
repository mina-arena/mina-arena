<script lang="ts">
	import { closeModal } from 'svelte-modals';
	import { squads } from '$lib/stores/sandbox/squadStore';

	// provided by Modals
	export let isOpen: boolean;

	export let unit: Unit;
	export let player: string;

	let drafteeName = '';

	const draft = () => {
		$squads[player].units.push({
			player,
			unit: unit,
			name: drafteeName
		});
		$squads[player] = $squads[player];
		drafteeName = '';
	};
</script>

{#if isOpen}
	<div class="modal">
		<form on:submit|preventDefault={draft} class="w-[500px] h-[400px] rounded-xl p-16 bg-stone-300 flex flex-col text-center justify-center pointer-events-auto">
			<h2 class="font-almendra-bold text-3xl mb-8">Draft new {unit.name}</h2>

			<input class="_input p-2 mb-4 rounded-md" autofocus type="text" placeholder="Name your {unit.name}" bind:value={drafteeName} />
			<button class="bg-stone-700 text-stone-300 w-auto rounded p-2">Draft Unit</button>
		</form>
	</div>
{/if}
