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
					class="border border-slate-300 rounded p-3 col-span-1 bg-slate-100 cursor-pointer"
				>
					<p><b>{playerUnit.name} ({playerUnit.unit.name})</b></p>
					<table class="mx-auto">
						<tr class="[&>*]:px-[3px]">
							<th><i class="fa-solid fa-shield" title="Armor Save Roll"></i></th>
							<th><i class="fa-solid fa-heart" title="Max Health"></i></th>
							<th><i class="fa-solid fa-circle-dollar" title="Points Cost"></i></th>
						</tr>
						<tr class="[&>*]:px-[3px]">
							<td title="Armor save roll">{playerUnit.unit.armorSaveRoll}+</td>
							<td title="Max Health">{playerUnit.unit.maxHealth}</td>
							<td title="Points Cost">{playerUnit.unit.pointsCost}</td>
						</tr>
					</table>
					<table class="mt-4 mx-auto">
						<tr class="[&>*]:px-[3px]">
							<th></th>
							<th><i class="fa-solid fa-hashtag" title="Number of Attacks"></i></th>
							<th><i class="fa-solid fa-bullseye-arrow" title="Hit Roll"></i></th>
							<th><i class="fa-solid fa-hand-fist" title="Wound Roll"></i></th>
							<th><i class="fa-solid fa-shield-slash" title="Armor Piercing"></i></th>
							<th><i class="fa-solid fa-heart-crack" title="Damage"></i></th>
						</tr>
						<tr class="[&>*]:px-[3px]">
							<td><i class="fa-solid fa-sword" title="Melee Attacks"></i></td>
							<td title="Number of Attacks">{playerUnit.unit.meleeNumAttacks}</td>
							<td title="Hit Roll">{playerUnit.unit.meleeHitRoll}+</td>
							<td title="Wound Roll">{playerUnit.unit.meleeWoundRoll}+</td>
							<td title="Armor Piercing">{playerUnit.unit.meleeArmorPiercing}</td>
							<td title="Damage">{playerUnit.unit.meleeDamage}</td>
						</tr>
						{#if playerUnit.unit.rangedNumAttacks}
							<tr class="[&>*]:px-[3px]">
								<td><i class="fa-solid fa-bow-arrow" title="Ranged Attacks"></i></td>
								<td title="Number of Attacks">{playerUnit.unit.rangedNumAttacks}</td>
								<td title="Hit Roll">{playerUnit.unit.rangedHitRoll}+</td>
								<td title="Wound Roll">{playerUnit.unit.rangedWoundRoll}+</td>
								<td title="Armor Piercing">{playerUnit.unit.rangedArmorPiercing}</td>
								<td title="Damage">{playerUnit.unit.rangedDamage}</td>
							</tr>
						{/if}
					</table>
				</div>
			{:else}
				<div
					on:click={() => addItem(playerUnit)}
					on:keypress={() => addItem(playerUnit)}
					class="border border-slate-300 rounded py-6 col-span-1 cursor-pointer"
				>
					<p><b>{playerUnit.name} ({playerUnit.unit.name})</b></p>
					<table class="mx-auto">
						<tr class="[&>*]:px-[3px]">
							<th><i class="fa-solid fa-shield" title="Armor Save Roll"></i></th>
							<th><i class="fa-solid fa-heart" title="Max Health"></i></th>
							<th><i class="fa-solid fa-circle-dollar" title="Points Cost"></i></th>
						</tr>
						<tr class="[&>*]:px-[3px]">
							<td title="Armor save roll">{playerUnit.unit.armorSaveRoll}+</td>
							<td title="Max Health">{playerUnit.unit.maxHealth}</td>
							<td title="Points Cost">{playerUnit.unit.pointsCost}</td>
						</tr>
					</table>
					<table class="mt-4 mx-auto">
						<tr class="[&>*]:px-[3px]">
							<th></th>
							<th><i class="fa-solid fa-hashtag" title="Number of Attacks"></i></th>
							<th><i class="fa-solid fa-bullseye-arrow" title="Hit Roll"></i></th>
							<th><i class="fa-solid fa-hand-fist" title="Wound Roll"></i></th>
							<th><i class="fa-solid fa-shield-slash" title="Armor Piercing"></i></th>
							<th><i class="fa-solid fa-heart-crack" title="Damage"></i></th>
						</tr>
						<tr class="[&>*]:px-[3px]">
							<td><i class="fa-solid fa-sword" title="Melee Attacks"></i></td>
							<td title="Number of Attacks">{playerUnit.unit.meleeNumAttacks}</td>
							<td title="Hit Roll">{playerUnit.unit.meleeHitRoll}+</td>
							<td title="Wound Roll">{playerUnit.unit.meleeWoundRoll}+</td>
							<td title="Armor Piercing">{playerUnit.unit.meleeArmorPiercing}</td>
							<td title="Damage">{playerUnit.unit.meleeDamage}</td>
						</tr>
						{#if playerUnit.unit.rangedNumAttacks}
							<tr class="[&>*]:px-[3px]">
								<td><i class="fa-solid fa-bow-arrow" title="Ranged Attacks"></i></td>
								<td title="Number of Attacks">{playerUnit.unit.rangedNumAttacks}</td>
								<td title="Hit Roll">{playerUnit.unit.rangedHitRoll}+</td>
								<td title="Wound Roll">{playerUnit.unit.rangedWoundRoll}+</td>
								<td title="Armor Piercing">{playerUnit.unit.rangedArmorPiercing}</td>
								<td title="Damage">{playerUnit.unit.rangedDamage}</td>
							</tr>
						{/if}
					</table>
				</div>
			{/if}
		{/each}
	{/if}
</div>
