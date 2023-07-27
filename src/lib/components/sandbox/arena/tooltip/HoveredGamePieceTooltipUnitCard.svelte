<script lang="ts">
  import { imagePathForUnit } from '$lib/utils';

  export let hoveredPiece: GamePiece;
</script>

{#if hoveredPiece}
  {@const hoveredUnit = hoveredPiece.playerUnit.unit}
  {@const unitImagePath = imagePathForUnit(hoveredUnit)}
  <div class="col-span-1">
    {#if unitImagePath}
      <img class="rounded w-full" alt="Unit image" src={unitImagePath} width="200" height="200" />
    {:else}
      No image for unit
    {/if}
  </div>
  <div class="font-almendra-bold uppercase bg-stone-300 p-2 mb-2 rounded text-center">
    {hoveredPiece.playerUnit.name} ({hoveredUnit.name})
  </div>
  <div class="bg-stone-300 p-2 rounded flex-grow flex flex-col justify-center">
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
{/if}
