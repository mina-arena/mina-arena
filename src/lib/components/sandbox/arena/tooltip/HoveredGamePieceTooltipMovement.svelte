<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { onAfterUpdate } from './tooltip-helpers';
	import HoveredGamePieceTooltipUnitCard from './HoveredGamePieceTooltipUnitCard.svelte';

	export let hoveredPiece: GamePiece | undefined;
	export let tooltipAbsolutePosition: Point | undefined;
	export let playerPublicKeys: Array<string>;
	export let playerColors: Array<string>;

	afterUpdate(() => {
		onAfterUpdate(playerPublicKeys, playerColors, hoveredPiece, undefined, tooltipAbsolutePosition);
	});
</script>

<div
	id="piece-hover-tooltip"
	class="hidden fixed max-w-[300px] overflow-hidden p-4 rounded-2xl bg-stone-900 text-stone-700 drop-shadow-lg"
>
	{#if hoveredPiece}
		<HoveredGamePieceTooltipUnitCard {hoveredPiece} />
	{/if}
</div>
