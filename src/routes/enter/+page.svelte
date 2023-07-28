<script lang="ts">
	import { MinaArenaClient } from "$lib/mina-arena-graphql-client/MinaArenaClient";
	import { dummyPlayer, player1 as player1Store } from '$lib/stores/sandbox/playerStore';
	import { onMount } from "svelte";
	import NavItem from '$lib/components/utils/NavItem.svelte';
	import { truncateMinaPublicKey } from "$lib/utils";

	const player1 = $player1Store.publicKey;
	const player2 = $dummyPlayer.publicKey;

	const minaArenaClient = new MinaArenaClient();
	let myGames: Game[] = [];
	onMount(() => {
		minaArenaClient.getPlayerGames(player1, ['IN_PROGRESS']).then((resp) => {
			myGames = resp;
		});
	});
</script>

<div class="p-12">
	<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase">Choose your path</h1>
	{#if myGames}
		<div class="mx-auto w-fit">
			<p>Your games in progress:</p>
			<table class="mx-auto border border-slate-300">
				<tr class="[&>*]:p-2 [&>*]:text-center border-b border-slate-300">
					<th>Your Turn?</th>
					<th>Turn</th>
					<th>Phase</th>
					<th>Opponent</th>
					<th>Actions</th>
				</tr>
				{#if myGames.length > 0}
					{#each myGames as game}
						{@const opponents = game.gamePlayers?.filter(gp => (gp.player.minaPublicKey !== player1))}
						<tr class="[&>*]:p-2 [&>*]:text-center border-b border-slate-300">
							<td class="text-red-600">{game.currentPhase?.gamePlayer.player.minaPublicKey === player1 ? 'Your Turn!' : ''}</td>
							<td>Turn {game.currentPhase?.turnNumber}</td>
							<td>{game.currentPhase?.name}</td>
							<td>{opponents ? truncateMinaPublicKey(opponents[0].player.minaPublicKey) : ''}</td>
							<td>
								<NavItem href="/sandbox/games/{game.id}">Join</NavItem>
							</td>
						</tr>
					{/each}
				{:else}
					<tr class="[&>*]:p-2 [&>*]:text-center border-b border-slate-300">
						<td align="center" colspan="5">No games in progress</td>
					</tr>
				{/if}
			</table>
		</div>
	{/if}
	<div class="w-1/4 border border-slate-300 mx-auto mt-10 cursor-pointer hover:bg-slate-200">
		<a href="/sandbox" class="text-center card rounded p-2">
			<h3 class="text-xl mb-3">New Game (Sandbox)</h3>
			<p class="text-slate-600">
				In sandbox mode, you control both sides. It's a good way to learn the game or practice a
				strategy.
			</p>
		</a>
	</div>
</div>
