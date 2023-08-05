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

<!-- Tabs -->
<div class="flex px-12 font-almendra-bold text-debossed uppercase">
	<div
		on:click={() => {
			pageSelected = 'PLAYER_UNIT';
		}}
		on:keypress={() => {
			pageSelected = 'PLAYER_UNIT';
		}}
		class={pageSelected === 'PLAYER_UNIT'
			? 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer bg-white/25 drop-shadow-md border-t-[1px] border-white/40'
			: 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer'}
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
			? 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer bg-white/25 drop-shadow-md border-t-[1px] border-white/40'
			: 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer'}
	>
		Draft Units
	</div>
</div>

<div
	class="flex-grow grid grid-cols-12 p-12 mx-auto gap-16 bg-white/25 backdrop-blur relative z-10 text-stone-800"
>
	<div class="col-span-6 lg:col-span-8 2xl:col-span-9">
		{#if pageSelected === 'UNIT'}
			<div class="grid lg:grid-cols-2 2xl:grid-cols-3 gap-16">
				<DraftNewUnits {player} />
			</div>
		{:else if pageSelected === 'PLAYER_UNIT'}
			<div class="grid lg:grid-cols-2 2xl:grid-cols-3 gap-16">
				<MyUnits {player} />
			</div>
		{/if}
	</div>
	<div class="col-span-6 lg:col-span-4 2xl:col-span-3">
		<div class="sticky top-16">
			<h2 class="font-almendra-bold text-2xl">Your Squad</h2>
			{#key $squads[player]}
				<table
					class="my-4 mx-auto border-spacing-y-[1px] text-[16px] table-fixed w-full border-separate rounded-xl overflow-hidden"
				>
					<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-200">
						<th>Name</th>
						<th>Unit</th>
						<th>Cost</th>
					</tr>
					{#each currentSquad().units as unit}
						<tr class="[&>*]:p-2 [&>*]:bg-stone-300">
							<td>{unit.name}</td>
							<td>{unit.unit.name}</td>
							<td>{unit.unit.pointsCost}</td>
						</tr>
					{/each}
					{#each currentSquad().playerUnits as playerUnit}
						<tr class="[&>*]:p-2 [&>*]:bg-stone-300">
							<td>{playerUnit.name}</td>
							<td>{playerUnit.unit.name}</td>
							<td>{playerUnit.unit.pointsCost}</td>
						</tr>
					{/each}
					<tr class="[&>*]:p-2 [&>*]:bg-stone-200">
						<td />
						<td />
						<td class="font-bold"
							><span class={totalCost() > 100 ? 'text-red-400' : ''}>{totalCost()}</span>/100</td
						>
					</tr>
				</table>
				<div class="grid grid-cols-2 mx-auto">
					{#if totalCost() > 100 || totalCost() <= 0}
						<div class="col-span-1">
							<button
								on:click={() => {}}
								class="mx-auto cursor-default m-2 p-2 rounded-lg border border-stone-500 bg-stone-300 text-stone-100"
							>
								<i class="fa fa-solid fa-check" /> Select Squad
							</button>
						</div>
						<div class="col-span-1">
							<button
								on:click={resetSquad}
								class="mx-auto cursor-default m-2 p-2 rounded-lg border border-stone-500 bg-stone-300 text-stone-100"
							>
								<i class="fa fa-solid fa-refresh" /> Reset Squad
							</button>
						</div>
					{:else}
						<div class="col-span-1">
							<button
								on:click={selectSquad}
								class="mx-auto m-2 p-2 rounded-lg border border-stone-500 bg-stone-600 text-stone-200"
							>
								<i class="fa fa-solid fa-check" /> Select Squad
							</button>
						</div>
						<div class="col-span-1">
							<button
								on:click={resetSquad}
								class="mx-auto m-2 p-2 rounded-lg border border-stone-500 bg-stone-600 text-stone-200"
							>
								<i class="fa fa-solid fa-refresh" /> Reset Squad
							</button>
						</div>
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>
