<script lang="ts">
	import { units } from '$lib/stores/sandbox/unitStore';

	export let toggleUnitSelected: (unit: Unit) => void;
</script>

<div class="grid grid-cols-5 gap-6 w-3/4 mx-auto mb-6">
	{#each $units as unit}
		{#if unit.selected}
			<div
				class="border border-slate-800 rounded py-6 col-span-1 bg-slate-200"
				on:click={() => toggleUnitSelected(unit)}
				on:keypress={() => toggleUnitSelected(unit)}
			>
				<p>{unit.id} (selected)</p>
				<p>Cost: {unit.cost}</p>
			</div>
		{:else}
			<div
				class="border border-slate-300 rounded py-6 col-span-1"
				on:click={() => toggleUnitSelected(unit)}
				on:keypress={() => toggleUnitSelected(unit)}
			>
				<p>{unit.id}</p>
				<p>Cost: {unit.cost}</p>
			</div>
		{/if}
	{/each}
</div>
