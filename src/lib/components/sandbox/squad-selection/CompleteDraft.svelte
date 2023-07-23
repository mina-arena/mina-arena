<script lang="ts">
	import { squads } from '$lib/stores/sandbox/squadStore';
	import { dummyPlayer, player1 as player1Store } from '$lib/stores/sandbox/playerStore';

	const player1 = $player1Store.publicKey;
	const player2 = $dummyPlayer.publicKey;

	export let startGame: () => {};
</script>

<div>
  <h3>Squads</h3>
  <div class="grid grid-cols-2 gap-6mx-auto">
    <div class="col-span-1">
      <h4>Player 1</h4>
      <table class="mx-auto mt-[20px]">
        <tr class="[&>*]:px-[15px]">
          <th>Name</th>
          <th>Unit</th>
          <th>Cost</th>
        </tr>
        {#each $squads[player1].units as unit}
          <tr class="[&>*]:px-[15px]">
            <td>{unit.name}</td>
            <td>{unit.unit.name}</td>
            <td>{unit.unit.pointsCost}</td>
          </tr>
        {/each}
        {#each $squads[player1].playerUnits as playerUnit}
          <tr class="[&>*]:px-[15px]">
            <td>{playerUnit.name}</td>
            <td>{playerUnit.unit.name}</td>
            <td>{playerUnit.unit.pointsCost}</td>
          </tr>
        {/each}
      </table>
    </div>
    <div class="col-span-1">
      <h4>Player 2</h4>
      <table class="mx-auto mt-[20px]">
        <tr class="[&>*]:px-[15px]">
          <th>Name</th>
          <th>Unit</th>
          <th>Cost</th>
        </tr>
        {#each $squads[player2].units as unit}
          <tr class="[&>*]:px-[15px]">
            <td>{unit.name}</td>
            <td>{unit.unit.name}</td>
            <td>{unit.unit.pointsCost}</td>
          </tr>
        {/each}
        {#each $squads[player2].playerUnits as playerUnit}
          <tr class="[&>*]:px-[15px]">
            <td>{playerUnit.name}</td>
            <td>{playerUnit.unit.name}</td>
            <td>{playerUnit.unit.pointsCost}</td>
          </tr>
        {/each}
      </table>
    </div>
  </div>
</div>
<button class="rounded p-2 mt-[30px]" on:click={startGame}>Complete Draft</button>