<script lang="ts">
  import { imagePathForUnit } from '$lib/utils';

  export let hoveredPiece: GamePiece;
</script>

{#if hoveredPiece}
  {@const hoveredUnit = hoveredPiece.playerUnit.unit}
  {@const unitImagePath = imagePathForUnit(hoveredUnit)}
  <div class="grid grid-cols-2 gap-4mx-auto">
    <div class="col-span-1">
      {#if unitImagePath}
        <img alt="Unit image" src={unitImagePath} width="150" height="150" />
      {:else}
        No image for unit
      {/if}
    </div>
    <div class="col-span-1">
      <div class="text-center">{hoveredPiece.playerUnit.name}</div>
      <div class="text-center">{hoveredUnit.name}</div>

      <table class="mx-auto">
        <tr class="[&>*]:px-[4px] [&>*]:text-center">
          <th><i class="fa-solid fa-person-running-fast"></i></th>
          <th><i class="fa-solid fa-shield"></i></th>
          <th><i class="fa-solid fa-heart"></i></th>
        </tr>
        <tr class="[&>*]:px-[4px] [&>*]:text-center">
          <td>{hoveredUnit.movementSpeed}</td>
          <td>{hoveredUnit.armorSaveRoll}+</td>
          <td>{hoveredPiece.health}/{hoveredUnit.maxHealth}</td>
        </tr>
      </table>
      <table class="mx-auto mt-[5px]">
        <tr class="[&>*]:px-[4px] [&>*]:text-center">
          <th></th>
          <th><i class="fa-solid fa-hashtag"></i></th>
          <th><i class="fa-solid fa-bullseye-arrow"></i></th>
          <th><i class="fa-solid fa-hand-fist"></i></th>
          <th><i class="fa-solid fa-shield-slash"></i></th>
          <th><i class="fa-solid fa-heart-crack"></i></th>
        </tr>
        <tr class="[&>*]:px-[4px] [&>*]:text-center">
          <td><i class="fa-solid fa-sword"></i></td>
          <td>{hoveredUnit.meleeNumAttacks}</td>
          <td>{hoveredUnit.meleeHitRoll}+</td>
          <td>{hoveredUnit.meleeWoundRoll}+</td>
          <td>{hoveredUnit.meleeArmorPiercing}</td>
          <td>{hoveredUnit.meleeDamage}</td>
        </tr>
        {#if hoveredUnit.rangedNumAttacks}
          <tr class="[&>*]:px-[4px] [&>*]:text-center">
            <td><i class="fa-solid fa-bow-arrow"></i></td>
            <td>{hoveredUnit.rangedNumAttacks}</td>
            <td>{hoveredUnit.rangedHitRoll}+</td>
            <td>{hoveredUnit.rangedWoundRoll}+</td>
            <td>{hoveredUnit.rangedArmorPiercing}</td>
            <td>{hoveredUnit.rangedDamage}</td>
          </tr>
        {/if}
      </table>
    </div>
  </div>
{/if}
