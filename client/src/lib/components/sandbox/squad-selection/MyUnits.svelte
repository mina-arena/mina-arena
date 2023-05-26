<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { playerUnits } from '$lib/stores/sandbox/playerUnitStore';
	import { squads } from '$lib/stores/sandbox/squadStore';

	export let player: string;

	let selected = new Set<number>();

	const minaArenaClient = new MinaArenaClient();

	onMount(() => {
		minaArenaClient.getPlayerUnits(player).then((resp) => {
			$playerUnits[player] = resp;
		});
	});

	const addItem = (playerUnit: PlayerUnit) => {
		selected.add(playerUnit.id);
		selected = selected;
		$squads[player].playerUnits.push(playerUnit);
		$squads[player] = $squads[player];
	};

	const removeItem = (playerUnit: PlayerUnit) => {
		selected.delete(playerUnit.id);
		selected = selected;
		const index = $squads[player].playerUnits.indexOf(playerUnit);
		console.log(index);
		if (index > -1) {
			$squads[player].playerUnits.splice(index, 1);
		}
		$squads[player] = $squads[player];
	};
</script>

<div class="grid grid-cols-3 gap-4 w-3/4">
	{#if $playerUnits[player]}
		{#each $playerUnits[player] as playerUnit}
			{#if selected.has(playerUnit.id)}
				<div
					on:click={() => removeItem(playerUnit)}
					on:keypress={() => removeItem(playerUnit)}
					class="border border-slate-300 rounded p-3 col-span-1 bg-slate-100"
				>
					<p><b>{playerUnit.name}</b></p>
					<p>Cost: {playerUnit.unit.pointsCost}</p>
					<p>HP: {playerUnit.unit.maxHealth}, Armor: {playerUnit.unit.armorSaveRoll}</p>
					<p>Melee: {playerUnit.unit.meleeHitRoll}+/{playerUnit.unit.meleeWoundRoll}+/{playerUnit.unit.meleeArmorPiercing}/{playerUnit.unit.meleeDamage}</p>
					{#if playerUnit.unit.rangedNumAttacks}
						<p>Ranged: {playerUnit.unit.rangedHitRoll}+/{playerUnit.unit.rangedWoundRoll}+/{playerUnit.unit.rangedArmorPiercing}/{playerUnit.unit.rangedDamage}</p>
					{/if}
				</div>
			{:else}
				<div
					on:click={() => addItem(playerUnit)}
					on:keypress={() => addItem(playerUnit)}
					class="border border-slate-300 rounded py-6 col-span-1"
				>
					<p><b>{playerUnit.name}</b></p>
					<p>Cost: {playerUnit.unit.pointsCost}</p>
					<p>HP: {playerUnit.unit.maxHealth}, Armor: {playerUnit.unit.armorSaveRoll}</p>
					<p>Melee: {playerUnit.unit.meleeHitRoll}+/{playerUnit.unit.meleeWoundRoll}+/{playerUnit.unit.meleeArmorPiercing}/{playerUnit.unit.meleeDamage}</p>
					{#if playerUnit.unit.rangedNumAttacks}
						<p>Ranged: {playerUnit.unit.rangedHitRoll}+/{playerUnit.unit.rangedWoundRoll}+/{playerUnit.unit.rangedArmorPiercing}/{playerUnit.unit.rangedDamage}</p>
					{/if}
				</div>
			{/if}
		{/each}
	{/if}
</div>
