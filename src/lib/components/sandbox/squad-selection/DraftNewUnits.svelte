<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { openModal } from 'svelte-modals';
	import { units } from '$lib/stores/sandbox/unitStore';
	import DraftUnitModal from '$lib/components/modals/DraftUnitModal.svelte';
	import DraftUnitCard from './DraftUnitCard.svelte';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	export let player: string;

	const minaArenaClient = new MinaArenaClient();
	onMount(() => {
		try {
			if ($units.length === 0) {
				minaArenaClient.getUnits().then((resp) => {
					$units = resp;
				});
			}
		} catch (err) {
			$errorString = String(err);
		}
	});

	const openUnitDraftModal = (unit: Unit) => {
		console.log(unit);
		openModal(DraftUnitModal, { unit, player });
	};
</script>

<div class="grid lg:grid-cols-2 2xl:grid-cols-3 gap-16">
{#each $units as unit}
	<DraftUnitCard {unit} {openUnitDraftModal} />
{/each}
</div>