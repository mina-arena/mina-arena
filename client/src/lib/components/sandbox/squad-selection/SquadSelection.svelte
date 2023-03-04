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

	let player = 1;
	const player1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
	const player2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';

	const currentPlayer = () => {
		if (player === 1) {
			return player1;
		} else {
			return player2;
		}
	};

	const currentSquad = (): Squad => {
		return $squads[currentPlayer()];
	};
</script>

<div>
	Your Squad:
	{#key $squads[currentPlayer()]}
		<div class="py-10 mb-10">
			<div class="grid grid-cols-5 gap-6mx-auto">
				<div class="col-span-1">Total Cost: {totalCost()}</div>
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
			<DraftNewUnits player={currentPlayer()} />
		{:else if pageSelected === 'PLAYER_UNIT'}
			<MyUnits player={currentPlayer()} />
		{/if}
	</div>
</div>
