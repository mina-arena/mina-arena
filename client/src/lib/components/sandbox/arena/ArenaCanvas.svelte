<script lang="ts">
  import ArenaCanvasMovementPhase from "./ArenaCanvasMovementPhase.svelte";
  import HoveredGamePieceTooltip from '../arena/HoveredGamePieceTooltip.svelte';
  import { afterUpdate, onMount } from 'svelte';
	import * as Utils from '../play/utils';

  export let game: Game;
  export let playerPublicKeys: Array<string>;
  export let playerColors: Array<string>;
  export let rerender: () => {};

  let hoveredPiece: GamePiece | undefined;
	let selectedPiece: GamePiece | undefined;
	let hoveredPieceTooltipPosition: Point | undefined;

  const onGamePieceHovered = (piece: GamePiece, mouseAbsolutePoint: Point) => {
		hoveredPiece = piece;
		hoveredPieceTooltipPosition = mouseAbsolutePoint;
	}

	const onGamePieceUnhovered = () => {
		hoveredPiece = undefined;
	}
</script>

{#if game.currentPhase?.name === 'MOVEMENT'}
  <ArenaCanvasMovementPhase
    game={game}
    playerColors={playerColors}
    pieceHoveredHandler={onGamePieceHovered}
    pieceUnhoveredHandler={onGamePieceUnhovered}
    rerender={rerender}
  />
{/if}
<HoveredGamePieceTooltip
  hoveredPiece={hoveredPiece}
  tooltipAbsolutePosition={hoveredPieceTooltipPosition}
  playerPublicKeys={playerPublicKeys}
  playerColors={playerColors}
/>
