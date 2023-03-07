<script lang="ts">
	import { units } from '$lib/stores/sandbox/unitStore';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import DraftNewUnits from './DraftNewUnits.svelte';
	import MyUnits from './MyUnits.svelte';

	type PageSelected = 'UNIT' | 'PLAYER_UNIT';

	let pageSelected: PageSelected = 'UNIT';
</script>

<div class="grid grid-cols-5 gap-6 w-3/4 mx-auto">
	<div class="border border-slate-300 rounded py-6 col-span-1">
		<div
			on:click={() => {
				pageSelected = 'PLAYER_UNIT';
			}}
			on:keypress={() => {
				pageSelected = 'PLAYER_UNIT';
			}}
			class={pageSelected === 'PLAYER_UNIT'
				? 'border border-slate-600 rounded p-1 bg-slate-100'
				: 'border border-slate-300 rounded p-1'}
		>
			My Units
		</div>
		<div
			on:click={() => {
				pageSelected = 'UNIT';
			}}
			on:keypress={() => {
				pageSelected = 'UNIT';
			}}
			class={pageSelected === 'UNIT'
				? 'border border-slate-600 rounded p-1 bg-slate-100'
				: 'border border-slate-300 rounded p-1'}
		>
			Draft Units
		</div>
	</div>

	<div class="border border-slate-300 rounded py-6 col-span-4 pl-6">
		{#if pageSelected === 'UNIT'}
			<DraftNewUnits />
		{:else if pageSelected === 'PLAYER_UNIT'}
			<MyUnits />
		{/if}
	</div>

	<!-- {#each $units as unit}
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
	{/each} -->
</div>
