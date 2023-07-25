<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { openModal } from 'svelte-modals';
	import { units } from '$lib/stores/sandbox/unitStore';
	import DraftUnitModal from '$lib/components/modals/DraftUnitModal.svelte';
	import DraftUnitCard from './DraftUnitCard.svelte';

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

<div class="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-16">
	{#each $units as unit}
		<DraftUnitCard {unit} {openUnitDraftModal} />
	{/each}
</div>
