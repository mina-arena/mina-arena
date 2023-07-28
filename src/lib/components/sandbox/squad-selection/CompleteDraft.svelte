<script lang="ts">
	import { squads } from '$lib/stores/sandbox/squadStore';
	import {
		player2 as player2Store,
		player1 as player1Store
	} from '$lib/stores/sandbox/playerStore';

	const player1 = $player1Store.publicKey;
	const player2 = $player2Store.publicKey;

	export let startGame: () => {};
</script>

<div>
	<h1 class="font-almendra-bold text-4xl uppercase">Squads</h1>
	<div class="grid grid-cols-2 gap-6mx-auto">
		<div class="col-span-1">
			<h3 class="font-almendra-bold text-2xl uppercase">Player 1</h3>
			<table
				class="mx-auto mt-[20px] border-spacing-y-[1px] border-separate rounded-xl overflow-hidden"
			>
				<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-400">
					<th>Name</th>
					<th>Unit</th>
					<th>Cost</th>
				</tr>
				{#each $squads[player1].units as unit}
					<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-300">
						<td>{unit.name}</td>
						<td>{unit.unit.name}</td>
						<td>{unit.unit.pointsCost}</td>
					</tr>
				{/each}
				{#each $squads[player1].playerUnits as playerUnit}
					<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-300">
						<td>{playerUnit.name}</td>
						<td>{playerUnit.unit.name}</td>
						<td>{playerUnit.unit.pointsCost}</td>
					</tr>
				{/each}
			</table>
		</div>
		<div class="col-span-1">
			<h3 class="font-almendra-bold text-2xl uppercase">Player 2</h3>
			<table
				class="mx-auto mt-[20px] border-spacing-y-[1px] border-separate rounded-xl overflow-hidden"
			>
				<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-400">
					<th>Name</th>
					<th>Unit</th>
					<th>Cost</th>
				</tr>
				{#each $squads[player2].units as unit}
					<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-300">
						<td>{unit.name}</td>
						<td>{unit.unit.name}</td>
						<td>{unit.unit.pointsCost}</td>
					</tr>
				{/each}
				{#each $squads[player2].playerUnits as playerUnit}
					<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:bg-stone-300">
						<td>{playerUnit.name}</td>
						<td>{playerUnit.unit.name}</td>
						<td>{playerUnit.unit.pointsCost}</td>
					</tr>
				{/each}
			</table>
		</div>
	</div>
</div>
<button
	class="bg-stone-700 hover:bg-stone-900 text-stone-300 rounded py-2 px-4 mt-16"
	on:click={startGame}>Complete Draft</button
>
