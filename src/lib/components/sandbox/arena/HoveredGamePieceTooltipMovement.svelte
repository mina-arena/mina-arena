<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { onAfterUpdate } from './tooltip-helpers';
	import HoveredGamePieceTooltipUnitCard from './HoveredGamePieceTooltipUnitCard.svelte';

  export let hoveredPiece: GamePiece | undefined;
  export let tooltipAbsolutePosition: Point | undefined;
  export let playerPublicKeys: Array<string>;
  export let playerColors: Array<string>;

  afterUpdate(() => {
    onAfterUpdate(
      playerPublicKeys,
      playerColors,
      hoveredPiece,
      tooltipAbsolutePosition,
    );
  });
</script>

<span id="piece-hover-tooltip" class="p-2 hidden fixed overflow-hidden border border-solid border-black rounded">
  {#if hoveredPiece}
    <HoveredGamePieceTooltipUnitCard {hoveredPiece} />
  {/if}
</span>