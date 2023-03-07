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
		<div
			class="w-[500px] h-[400px] rounded-md p-4 bg-white flex flex-col justify-center pointer-events-auto"
		>
			<div>Draft new {unit.name}</div>
			<div>
				<label>Name:</label>
				<input class="border border-stone-300" type="text" bind:value={drafteeName} />
			</div>
			<button on:click={draft}>Draft Unit</button>
		</div>
	</div>
{/if}
