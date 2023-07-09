<script lang="ts">
	import { imagePathForUnit } from '$lib/utils';

	export let addItem: (playerUnit: PlayerUnit) => void;
	export let removeItem: (playerUnit: PlayerUnit) => void;
	export let playerUnit: PlayerUnit;
	export let selected = false;

	const cardBg = selected ? 'bg-slate-300' : '';
	const addOrRemoveItem = (playerUnit: PlayerUnit) => {
		if (selected) {
			removeItem(playerUnit);
		} else {
			addItem(playerUnit);
		}
	};
</script>

<div
	on:click={() => addOrRemoveItem(playerUnit)}
	on:keypress={() => addOrRemoveItem(playerUnit)}
	class="border border-slate-300 rounded pb-6 col-span-1 cursor-pointer {cardBg}"
>
	<div class="w-full rounded overflow-hidden pb-2">
		<img alt="archer" src={imagePathForUnit(playerUnit.unit)} />
	</div>
	<p><b>{playerUnit.name} ({playerUnit.unit.name})</b></p>
	<table class="mx-auto">
		<tr class="[&>*]:px-[3px]">
			<th><i class="fa-solid fa-shield" title="Armor Save Roll" /></th>
			<th><i class="fa-solid fa-heart" title="Max Health" /></th>
			<th><i class="fa-solid fa-circle-dollar" title="Points Cost" /></th>
		</tr>
		<tr class="[&>*]:px-[3px]">
			<td title="Armor save roll">{playerUnit.unit.armorSaveRoll}+</td>
			<td title="Max Health">{playerUnit.unit.maxHealth}</td>
			<td title="Points Cost">{playerUnit.unit.pointsCost}</td>
		</tr>
	</table>
	<table class="mt-2 mx-auto">
		<tr class="[&>*]:px-[3px]">
			<th />
			<th><i class="fa-solid fa-hashtag" title="Number of Attacks" /></th>
			<th><i class="fa-solid fa-bullseye-arrow" title="Hit Roll" /></th>
			<th><i class="fa-solid fa-hand-fist" title="Wound Roll" /></th>
			<th><i class="fa-solid fa-shield-slash" title="Armor Piercing" /></th>
			<th><i class="fa-solid fa-heart-crack" title="Damage" /></th>
		</tr>
		<tr class="[&>*]:px-[3px]">
			<td><i class="fa-solid fa-sword" title="Melee Attacks" /></td>
			<td title="Number of Attacks">{playerUnit.unit.meleeNumAttacks}</td>
			<td title="Hit Roll">{playerUnit.unit.meleeHitRoll}+</td>
			<td title="Wound Roll">{playerUnit.unit.meleeWoundRoll}+</td>
			<td title="Armor Piercing">{playerUnit.unit.meleeArmorPiercing}</td>
			<td title="Damage">{playerUnit.unit.meleeDamage}</td>
		</tr>
		{#if playerUnit.unit.rangedNumAttacks}
			<tr class="[&>*]:px-[3px]">
				<td><i class="fa-solid fa-bow-arrow" title="Ranged Attacks" /></td>
				<td title="Number of Attacks">{playerUnit.unit.rangedNumAttacks}</td>
				<td title="Hit Roll">{playerUnit.unit.rangedHitRoll}+</td>
				<td title="Wound Roll">{playerUnit.unit.rangedWoundRoll}+</td>
				<td title="Armor Piercing">{playerUnit.unit.rangedArmorPiercing}</td>
				<td title="Damage">{playerUnit.unit.rangedDamage}</td>
			</tr>
		{/if}
	</table>
</div>
