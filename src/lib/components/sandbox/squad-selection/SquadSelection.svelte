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
			cost += unit.pointsCost;
		});
		currentSquad().playerUnits.forEach((playerUnit) => {
			const { unit } = playerUnit;
			cost += unit.pointsCost;
		});
		return cost;
	};

	export let player: string;
	export let selectSquad: () => {};
	export let resetSquad: () => void;

	const currentSquad = (): Squad => {
		const existingSquad = $squads[player];
		if (!existingSquad) {
			$squads[player] = {
				units: [],
				playerUnits: []
			};
		}
		return $squads[player];
	};
</script>

<div class="grid grid-cols-5 mx-auto">
	<div class="col-span-4">
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
						? 'border border-slate-600 rounded p-1 cursor-pointer bg-slate-100'
						: 'border border-slate-300 rounded p-1 cursor-pointer'}
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
						? 'border border-slate-600 rounded p-1 cursor-pointer bg-slate-100'
						: 'border border-slate-300 rounded p-1 cursor-pointer'}
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
	</div>
	<div class="col-span-1">
		<div>
			Your Squad:
			{#key $squads[player]}
				<div class="py-10 mb-10">
					<table class="mx-auto">
						<tr class="[&>*]:px-[15px]">
							<th>Name</th>
							<th>Unit</th>
							<th>Cost</th>
						</tr>
						{#each currentSquad().units as unit}
							<tr class="[&>*]:px-[15px]">
								<td>{unit.name}</td>
								<td>{unit.unit.name}</td>
								<td>{unit.unit.pointsCost}</td>
							</tr>
						{/each}
						{#each currentSquad().playerUnits as playerUnit}
							<tr class="[&>*]:px-[15px]">
								<td>{playerUnit.name}</td>
								<td>{playerUnit.unit.name}</td>
								<td>{playerUnit.unit.pointsCost}</td>
							</tr>
						{/each}
						<tr class="[&>*]:px-[15px]">
							<td />
							<td />
							<td><span class={totalCost() > 100 ? 'text-red-400' : ''}>{totalCost()}</span>/100</td>
						</tr>
					</table>
				</div>
			{/key}
			<div class="grid grid-cols-2 mx-auto">
				<div class="col-span-1">
					<button on:click={selectSquad} class="mx-auto m-2 p-2 rounded-lg border border-slate-500 bg-gray-100 text-black">
						<i class="fa fa-solid fa-check"></i> Select Squad
					</button>
				</div>
				<div class="col-span-1">
					<button on:click={resetSquad} class="mx-auto m-2 p-2 rounded-lg border border-slate-500 bg-gray-100 text-black">
						<i class="fa fa-solid fa-refresh"></i> Reset Squad
					</button>
				</div>
			</div>
		</div>
	</div>
</div>
