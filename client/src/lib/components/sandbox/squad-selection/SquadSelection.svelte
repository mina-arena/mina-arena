<script lang="ts">
	import { squads } from '$lib/stores/sandbox/squadStore';
	import DraftNewUnits from './DraftNewUnits.svelte';
	import MyUnits from './MyUnits.svelte';

	type PageSelected = 'UNIT' | 'PLAYER_UNIT';

	let pageSelected: PageSelected = 'UNIT';

	const totalCost = () => {
		let cost = 0;
		currentSquad().units.forEach((draftee) => {
			const { unit } = draftee;
			cost += unit.attackPower + unit.armor + unit.maxHealth;
		});
		currentSquad().playerUnits.forEach((playerUnit) => {
			const { unit } = playerUnit;
			cost += unit.attackPower + unit.armor + unit.maxHealth;
		});
		return cost;
	};

	export let player: string;

	const currentSquad = (): Squad => {
		return $squads[player];
	};
</script>

<div>
	Your Squad:
	{#key $squads[player]}
		<div class="py-10 mb-10">
			<div class="grid grid-cols-5 gap-6mx-auto">
				<div class="col-span-1">Total Cost: {totalCost()}</div>
				<div class="col-span-1">Max Cost: 25</div>
			</div>
		</div>
		{#each currentSquad().units as unit}
			{JSON.stringify(unit)}
		{/each}
		{#each currentSquad().playerUnits as playerUnit}
			{JSON.stringify(playerUnit)}
		{/each}
	{/key}
</div>
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
			<DraftNewUnits {player} />
		{:else if pageSelected === 'PLAYER_UNIT'}
			<MyUnits {player} />
		{/if}
	</div>
</div>
