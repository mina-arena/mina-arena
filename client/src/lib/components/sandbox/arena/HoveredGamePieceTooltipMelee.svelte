<script lang="ts">
  import { afterUpdate } from 'svelte';
  import { onAfterUpdate } from './tooltip-helpers';
  import { estimatedMeleeAttackDamage } from '../play/utils';

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
        <div># Attacks: {hoveredUnit.meleeNumAttacks}</div>
        <div>To Hit: {hoveredUnit.meleeHitRoll}+</div>
        <div>To Wound: {hoveredUnit.meleeWoundRoll}+</div>
      {/if}
    {:else}
      {#if selectedPiece}
        {@const selectedUnit = selectedPiece.playerUnit.unit}
        {@const armorPiercing = selectedUnit.meleeArmorPiercing || 0}
        {@const modifiedSave = hoveredUnit.armorSaveRoll + armorPiercing}
        <div># Attacks: {selectedUnit.meleeNumAttacks}</div>
        <div>To Hit: {selectedUnit.meleeHitRoll}+</div>
        <div>To Wound: {selectedUnit.meleeWoundRoll}+</div>
        <div>Armor Save: {modifiedSave}+ ({hoveredUnit.armorSaveRoll}+, AP-{armorPiercing})</div>
        <div>Dmg / Attack: {selectedUnit.meleeDamage}</div>
        <div>Est Damage: {estimatedMeleeAttackDamage(selectedUnit, hoveredUnit)}</div>
      {:else}
        <div>Armor: {hoveredUnit.armorSaveRoll}+</div>
      {/if}      
    {/if}
  {/if}
</span>