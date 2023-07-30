<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { onMount } from 'svelte';
	import { truncateMinaPublicKey } from '$lib/utils';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	export let player: string;

	const minaArenaClient = new MinaArenaClient();
	let myGames: Game[] = [];
	let myGamesLoading = true;
	let error = false;

	onMount(async () => {
		try {
			const myGamesResp = await minaArenaClient.getPlayerGames(player, ['COMPLETED']);
			myGames = myGamesResp;
			myGamesLoading = false;
			error = false;
		} catch (err) {
			$errorString = String(err);
			myGamesLoading = false;
			error = true;
		}
	});
</script>

{#if myGamesLoading}
	<p class="mx-auto w-fit"><i class="fa fa-solid fa-refresh fa-spin" /> Loading...</p>
{:else if myGames && !error}
	<div class="mx-auto mt-[30px] w-fit">
		<table class="mx-auto border border-stone-500">
			<tr class="[&>*]:p-2 [&>*]:text-center border-b border-stone-500 bg-stone-300">
				<th class="border border-stone-500">W/L</th>
				<th class="border border-stone-500">Started At</th>
				<th class="border border-stone-500">Opponent</th>
				<th class="border border-stone-500">Turns</th>
			</tr>
			{#if myGames.length > 0}
				{#each myGames as game}
					{@const opponents = game.gamePlayers?.filter((gp) => gp.player.minaPublicKey !== player)}
					{@const win = game.winningGamePlayer?.player.minaPublicKey === player}
					<tr class="[&>*]:p-5 [&>*]:text-center border-b border-stone-500 bg-stone-100">
						<td
							class="border border-stone-500 {win
								? 'bg-green-200 text-green-800'
								: 'bg-red-200 text-red-700'}">{win ? 'Win' : 'Loss'}</td
						>
						<td class="border border-stone-500">{game.createdAt}</td>
						<td class="border border-stone-500"
							>{opponents ? truncateMinaPublicKey(opponents[0].player.minaPublicKey) : ''}</td
						>
						<td class="border border-stone-500">{game.currentPhase?.turnNumber} Turns</td>
					</tr>
				{/each}
			{:else}
				<tr class="[&>*]:p-2 [&>*]:text-center border-b border-stone-500">
					<td align="center" colspan="3">No completed games</td>
				</tr>
			{/if}
		</table>
	</div>
{/if}
