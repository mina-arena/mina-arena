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

<div class="flex-grow p-12 bg-arena-landscape-blurred bg-cover bg-fixed">
	<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase">Choose your path</h1>

	<div class="flex flex-col items-center lg:flex-row lg:items-stretch justify-center">
		{#if myGames}
			<div class="flex flex-col justify-center items-center text-center p-8 m-8 rounded-xl bg-white bg-opacity-50 drop-shadow-lg">
				<h2 class="font-almendra-bold text-2xl mb-3">Games in progress</h2>
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

		<div class="flex flex-col justify-center items-center text-center lg:w-1/4 max-w-md p-8 m-8 rounded-xl cursor-pointer bg-white hover:bg-stone-300 bg-opacity-50 drop-shadow-lg">
			<a href="/sandbox" class="text-center card rounded p-2">
				<h2 class="font-almendra-bold text-2xl mb-3">New Game (Sandbox)</h2>
				<div class="text-stone-600">
					In sandbox mode, you control both sides. It's a good way to learn the game or practice a
					strategy.
				</div>
			</a>
		</div>
	</div>
</div>
