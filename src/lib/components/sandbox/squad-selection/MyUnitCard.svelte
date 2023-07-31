<script lang="ts">
	import { imagePathForUnit } from '$lib/utils';

	export let addItem: (playerUnit: PlayerUnit) => void = () => {};
	export let removeItem: (playerUnit: PlayerUnit) => void = () => {};
	export let playerUnit: PlayerUnit;
	export let selected = false;
	export let viewOnly = false;

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
	class="relative flex flex-col p-4 rounded-2xl bg-stone-900 text-stone-700 col-span-1 {viewOnly
		? ''
		: 'cursor-pointer'} {selected ? 'bg-stone-600 scale-105 drop-shadow-lg' : ''}"
>
	<div class="relative w-full mb-2">
		<img class="rounded" alt={playerUnit.name} src={imagePathForUnit(playerUnit.unit)} />
		<div class="absolute flex items-center justify-center -right-2 -bottom-2">
			<i class="absolute text-[64px] fa-solid fa-heart" title="Armor Save Roll" />
			<span class="absolute text-white">{playerUnit.unit.maxHealth}</span>
		</div>
	</div>
	<div class="font-almendra-bold uppercase leading-none bg-stone-300 p-2 mb-2 rounded text-center">
		{playerUnit.name} ({playerUnit.unit.name})
	</div>
	<div class="bg-stone-300 p-2 rounded flex-grow flex justify-center">
		<table class="mx-auto">
			<tr class="[&>*]:px-[3px]">
				<th class="align-bottom text-center"
					><i class="fa-solid fa-circle-dollar" title="Points Cost" /></th
				>
			</tr>
			<tr class="[&>*]:px-[3px]">
				<td class="align-top text-center" title="Points Cost">{playerUnit.unit.pointsCost}</td>
			</tr>
		</table>
		<table class="mx-auto">
			<tr class="[&>*]:px-[3px]">
				<th />
				<th class="align-bottom text-center"
					><i class="fa-solid fa-hashtag" title="Number of Attacks" /></th
				>
				<th class="align-bottom text-center"
					><i class="fa-solid fa-bullseye-arrow" title="Hit Roll" /></th
				>
				<th class="align-bottom text-center"
					><i class="fa-solid fa-hand-fist" title="Wound Roll" /></th
				>
				<th class="align-bottom text-center"
					><i class="fa-solid fa-shield-slash" title="Armor Piercing" /></th
				>
				<th class="align-bottom text-center"
					><i class="fa-solid fa-heart-crack" title="Damage" /></th
				>
			</tr>
			<tr class="[&>*]:px-[3px]">
				<td class="align-top text-center"><i class="fa-solid fa-sword" title="Melee Attacks" /></td>
				<td class="align-top text-center" title="Number of Attacks"
					>{playerUnit.unit.meleeNumAttacks}</td
				>
				<td class="align-top text-center" title="Hit Roll">{playerUnit.unit.meleeHitRoll}+</td>
				<td class="align-top text-center" title="Wound Roll">{playerUnit.unit.meleeWoundRoll}+</td>
				<td class="align-top text-center" title="Armor Piercing"
					>{playerUnit.unit.meleeArmorPiercing}</td
				>
				<td class="align-top text-center" title="Damage">{playerUnit.unit.meleeDamage}</td>
			</tr>
			{#if playerUnit.unit.rangedNumAttacks}
				<tr class="[&>*]:px-[3px]">
					<td class="align-top text-center"
						><i class="fa-solid fa-bow-arrow" title="Ranged Attacks" /></td
					>
					<td class="align-top text-center" title="Number of Attacks"
						>{playerUnit.unit.rangedNumAttacks}</td
					>
					<td class="align-top text-center" title="Hit Roll">{playerUnit.unit.rangedHitRoll}+</td>
					<td class="align-top text-center" title="Wound Roll"
						>{playerUnit.unit.rangedWoundRoll}+</td
					>
					<td class="align-top text-center" title="Armor Piercing"
						>{playerUnit.unit.rangedArmorPiercing}</td
					>
					<td class="align-top text-center" title="Damage">{playerUnit.unit.rangedDamage}</td>
				</tr>
			{/if}
		</table>
	</div>
</div>
