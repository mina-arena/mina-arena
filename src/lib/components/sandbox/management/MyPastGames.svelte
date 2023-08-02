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
		<table class="my-4 mx-auto border-spacing-y-[1px] text-[16px] text-stone-800 table-fixed border-separate rounded-xl overflow-hidden">
			<tr class="[&>*]:py-2 [&>*]:px-8 [&>*]:text-center [&>*]:bg-stone-200">
				<th class="">W/L</th>
				<th class="">Started At</th>
				<th class="">Opponent</th>
				<th class="">Turns</th>
			</tr>
			{#if myGames.length > 0}
				{#each myGames as game}
					{@const opponents = game.gamePlayers?.filter((gp) => gp.player.minaPublicKey !== player)}
					{@const win = game.winningGamePlayer?.player.minaPublicKey === player}
					<tr class="[&>*]:p-5 [&>*]:text-center bg-stone-300">
						<td
							class="{win
								? 'bg-green-200 text-green-800'
								: 'bg-red-200 text-red-700'}">{win ? 'Win' : 'Loss'}</td
						>
						<td class="">{game.createdAt}</td>
						<td class=""
							>{opponents ? truncateMinaPublicKey(opponents[0].player.minaPublicKey) : ''}</td
						>
						<td class="">{game.currentPhase?.turnNumber} Turns</td>
					</tr>
				{/each}
			{:else}
				<tr class="[&>*]:p-5 [&>*]:text-center bg-stone-300">
					<td colspan="4">No completed games</td>
				</tr>
			{/if}
		</table>
	</div>
{/if}
