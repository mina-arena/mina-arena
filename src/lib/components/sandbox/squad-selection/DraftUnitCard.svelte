<script lang="ts">
	export let unit: Unit;
	export let openUnitDraftModal: (unit: Unit) => void;
</script>

<div
	on:click={() => {
		openUnitDraftModal(unit);
	}}
	on:keypress={() => {
		openUnitDraftModal(unit);
	}}
	class="border border-slate-300 rounded pb-6 col-span-1 cursor-pointer"
>
	<div class="w-full rounded overflow-hidden pb-2">
		<img alt="archer" src="/images/archer.png" />
	</div>
	<p><b>{unit.name}</b></p>
	<table class="mx-auto">
		<tr class="[&>*]:px-[3px]">
			<th><i class="fa-solid fa-shield" title="Armor Save Roll" /></th>
			<th><i class="fa-solid fa-heart" title="Max Health" /></th>
			<th><i class="fa-solid fa-circle-dollar" title="Points Cost" /></th>
		</tr>
		<tr class="[&>*]:px-[3px]">
			<td title="Armor save roll">{unit.armorSaveRoll}+</td>
			<td title="Max Health">{unit.maxHealth}</td>
			<td title="Points Cost">{unit.pointsCost}</td>
		</tr>
	</table>
	<table class="mt-4 mx-auto">
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
			<td title="Number of Attacks">{unit.meleeNumAttacks}</td>
			<td title="Hit Roll">{unit.meleeHitRoll}+</td>
			<td title="Wound Roll">{unit.meleeWoundRoll}+</td>
			<td title="Armor Piercing">{unit.meleeArmorPiercing}</td>
			<td title="Damage">{unit.meleeDamage}</td>
		</tr>
		{#if unit.rangedNumAttacks}
			<tr class="[&>*]:px-[3px]">
				<td><i class="fa-solid fa-bow-arrow" title="Ranged Attacks" /></td>
				<td title="Number of Attacks">{unit.rangedNumAttacks}</td>
				<td title="Hit Roll">{unit.rangedHitRoll}+</td>
				<td title="Wound Roll">{unit.rangedWoundRoll}+</td>
				<td title="Armor Piercing">{unit.rangedArmorPiercing}</td>
				<td title="Damage">{unit.rangedDamage}</td>
			</tr>
		{/if}
	</table>
</div>
