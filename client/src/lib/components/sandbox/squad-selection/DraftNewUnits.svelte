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
			class="border border-slate-300 rounded p-3 col-span-1"
		>
			<p><b>{unit.name}</b></p>
			<p>Cost: {unit.pointsCost}</p>
			<p>HP: {unit.maxHealth}, Armor: {unit.armorSaveRoll}</p>
			<p>Melee: {unit.meleeHitRoll}+/{unit.meleeWoundRoll}+/{unit.meleeArmorPiercing}/{unit.meleeDamage}</p>
			{#if unit.rangedNumAttacks}
				<p>Ranged: {unit.rangedHitRoll}+/{unit.rangedWoundRoll}+/{unit.rangedArmorPiercing}/{unit.rangedDamage}</p>
			{/if}
		</div>
	{/each}
</div>
