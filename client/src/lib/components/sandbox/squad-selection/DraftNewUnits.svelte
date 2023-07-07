<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { openModal } from 'svelte-modals';
	import { units } from '$lib/stores/sandbox/unitStore';
	import DraftUnitModal from '$lib/components/modals/DraftUnitModal.svelte';

	export let player: string;

	const minaArenaClient = new MinaArenaClient();
	onMount(() => {
		if ($units.length === 0) {
			minaArenaClient.getUnits().then((resp) => {
				$units = resp;
			});
		}
	});

	const openUnitDraftModal = (unit: Unit) => {
		console.log(unit);
		openModal(DraftUnitModal, { unit, player });
	};
</script>

<div class="grid grid-cols-3 gap-4 w-3/4">
	{#each $units as unit}
		<div
			on:click={() => {
				openUnitDraftModal(unit);
			}}
			on:keypress={() => {
				openUnitDraftModal(unit);
			}}
			class="border border-slate-300 rounded p-3 col-span-1 cursor-pointer"
		>
			<p><b>{unit.name}</b></p>
			<table class="mx-auto">
				<tr class="[&>*]:px-[3px]">
					<th><i class="fa-solid fa-shield" title="Armor Save Roll"></i></th>
					<th><i class="fa-solid fa-heart" title="Max Health"></i></th>
					<th><i class="fa-solid fa-circle-dollar" title="Points Cost"></i></th>
				</tr>
				<tr class="[&>*]:px-[3px]">
					<td title="Armor save roll">{unit.armorSaveRoll}+</td>
					<td title="Max Health">{unit.maxHealth}</td>
					<td title="Points Cost">{unit.pointsCost}</td>
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
					<td title="Number of Attacks">{unit.meleeNumAttacks}</td>
					<td title="Hit Roll">{unit.meleeHitRoll}+</td>
					<td title="Wound Roll">{unit.meleeWoundRoll}+</td>
					<td title="Armor Piercing">{unit.meleeArmorPiercing}</td>
					<td title="Damage">{unit.meleeDamage}</td>
				</tr>
				{#if unit.rangedNumAttacks}
					<tr class="[&>*]:px-[3px]">
						<td><i class="fa-solid fa-bow-arrow" title="Ranged Attacks"></i></td>
						<td title="Number of Attacks">{unit.rangedNumAttacks}</td>
						<td title="Hit Roll">{unit.rangedHitRoll}+</td>
						<td title="Wound Roll">{unit.rangedWoundRoll}+</td>
						<td title="Armor Piercing">{unit.rangedArmorPiercing}</td>
						<td title="Damage">{unit.rangedDamage}</td>
					</tr>
				{/if}
			</table>
		</div>
	{/each}
</div>
