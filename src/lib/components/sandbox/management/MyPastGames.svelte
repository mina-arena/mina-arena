<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
  import { truncateMinaPublicKey } from '$lib/utils';

	export let player: string;

	const minaArenaClient = new MinaArenaClient();
  let myGames: Game[] = [];
  let myGamesLoading = true;
	
  onMount(() => {
		minaArenaClient.getPlayerGames(player, ['COMPLETED']).then((resp) => {
			myGames = resp;
      myGamesLoading = false;
		});
	});
</script>

{#if myGamesLoading}
  <p class="mx-auto w-fit"><i class="fa fa-solid fa-refresh fa-spin"></i> Loading...</p>
{:else if myGames}
  <div class="mx-auto mt-[30px] w-fit">
    <table class="mx-auto border border-slate-300">
      <tr class="[&>*]:p-2 [&>*]:text-center border-b border-slate-300">
        <th>W/L</th>
        <th>Started At</th>
        <th>Opponent</th>
        <th>Turns</th>
      </tr>
      {#if myGames.length > 0}
        {#each myGames as game}
          {@const opponents = game.gamePlayers?.filter(gp => (gp.player.minaPublicKey !== player))}
          {@const win = game.winningGamePlayer?.player.minaPublicKey === player}
          <tr class="[&>*]:p-5 [&>*]:text-center border-b border-slate-300">
            <td class={win ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-700'}>{win ? 'Win' : 'Loss'}</td>
            <td>{game.createdAt}</td>
            <td>{opponents ? truncateMinaPublicKey(opponents[0].player.minaPublicKey) : ''}</td>
            <td>{game.currentPhase?.turnNumber} Turns</td>
          </tr>
        {/each}
      {:else}
        <tr class="[&>*]:p-2 [&>*]:text-center border-b border-slate-300">
          <td align="center" colspan="3">No completed games</td>
        </tr>
      {/if}
    </table>
  </div>
{/if}
