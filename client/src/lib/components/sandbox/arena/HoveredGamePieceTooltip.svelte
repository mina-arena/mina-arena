<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import * as Utils from '../play/utils';

  export let hoveredPiece: GamePiece | undefined;
  export let tooltipAbsolutePosition: Point | undefined;
  export let playerPublicKeys: Array<string>;
  export let playerColors: Array<string>;

  afterUpdate(() => {
    if (hoveredPiece) {
      showHoveredPieceTooltip();
    } else {
      hideHoveredPieceTooltip();
    }
  });

  // const showHoveredPieceTooltip = (absolutePoint: Point, hoveredPiece: GamePiece) => {
  const showHoveredPieceTooltip = () => {
    var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
    if (!tooltip || !hoveredPiece || !tooltipAbsolutePosition) return;

    const playerMinaPublicKey = hoveredPiece.gamePlayer.player.minaPublicKey;
    const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, playerColors);
    
    tooltip.style.left = (tooltipAbsolutePosition.x + 20) + 'px';
    tooltip.style.top = (tooltipAbsolutePosition.y + 20) + 'px';
    tooltip.style.display = 'block';
    tooltip.style.backgroundColor = playerColor;
  }

  const hideHoveredPieceTooltip = () => {
    var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
    if (!tooltip) return;
    
    tooltip.style.display = 'none';
  }

</script>

<span id="piece-hover-tooltip" class="p-2 hidden fixed overflow-hidden border border-solid border-black rounded">
  {#if hoveredPiece}
    {@const hoveredUnit = hoveredPiece.playerUnit.unit}
    <div>{hoveredPiece.playerUnit.name} ({hoveredUnit.name})</div>
    <div>HP: {hoveredPiece.health}/{hoveredUnit.maxHealth}</div>
    <div>Speed: {hoveredUnit.movementSpeed}</div>
    <div>Armor: {hoveredUnit.armorSaveRoll}+</div>
    {#if hoveredUnit.rangedNumAttacks}
      <div>Missile Range: {hoveredUnit.rangedRange}</div>
    {/if}
  {/if}
</span>