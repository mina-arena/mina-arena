

<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { onAfterUpdate } from './tooltip-helpers';
  import { estimatedRangedAttackDamage } from '../play/utils';

  export let game: Game;
  export let hoveredPiece: GamePiece | undefined;
  export let selectedPiece: GamePiece | undefined;
  export let tooltipAbsolutePosition: Point | undefined;
  export let playerPublicKeys: Array<string>;
  export let playerColors: Array<string>;

  let currentPlayerMinaPubKey: string = game.currentPhase?.gamePlayer.player.minaPublicKey || '';

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
    {@const owner = hoveredPiece.gamePlayer.player.minaPublicKey}
    {@const hoveredUnit = hoveredPiece.playerUnit.unit}

    <div>{hoveredPiece.playerUnit.name} ({hoveredUnit.name})</div>
    <div>HP: {hoveredPiece.health}/{hoveredUnit.maxHealth}</div>

    {#if owner === currentPlayerMinaPubKey}
      {#if selectedPiece && selectedPiece.id !== hoveredPiece.id}
        <div>Friendly unit</div>
      {:else}
        {#if hoveredUnit.rangedNumAttacks}
          <div># Attacks: {hoveredUnit.rangedNumAttacks}</div>
          <div>To Hit: {hoveredUnit.rangedHitRoll}+</div>
          <div>To Wound: {hoveredUnit.rangedWoundRoll}+</div>
        {:else}
          <div>No ranged attack</div>
        {/if}
      {/if}
    {:else}
      {#if selectedPiece}
        {@const selectedUnit = selectedPiece.playerUnit.unit}
        {#if selectedUnit.rangedNumAttacks}
          {@const armorPiercing = selectedUnit.rangedArmorPiercing || 0}
          {@const modifiedSave = hoveredUnit.armorSaveRoll + armorPiercing}
          <div># Attacks: {selectedUnit.rangedNumAttacks}</div>
          <div>To Hit: {selectedUnit.rangedHitRoll}+</div>
          <div>To Wound: {selectedUnit.rangedWoundRoll}+</div>
          <div>Armor Save: {modifiedSave}+ ({hoveredUnit.armorSaveRoll}+, AP-{selectedUnit.rangedArmorPiercing})</div>
          <div>Dmg / Attack: {selectedUnit.rangedDamage}</div>
          <div>Est Damage: {estimatedRangedAttackDamage(selectedUnit, hoveredUnit)}</div>
        {:else}
          <div>Selected unit has no ranged attack</div>
        {/if}
      {:else}
        <div>Armor: {hoveredUnit.armorSaveRoll}+</div>
      {/if}      
    {/if}
  {/if}
</span>