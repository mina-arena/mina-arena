<script lang="ts">
	import { goto } from '$app/navigation';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { player1, dummyPlayer, player1Default } from '$lib/stores/sandbox/playerStore';

	const isDummyPlayer = $player1.publicKey === player1Default.publicKey;
	const createGame = async () => {
		const minaArenaClient = new MinaArenaClient();
		const game = await minaArenaClient.createGame([$player1.publicKey, $dummyPlayer.publicKey]);
		console.log(game.id);
		goto(`/sandbox/games/${game.id}`);
	};
</script>

{#if isDummyPlayer}
	<div>
		<p>
			Currently logged in as the "dummy player". This is a keypair that Mina Arena created as a
			default. You can play a round using this key, but be advised that other players will be able
			to make moves on your board as well.
		</p>
		<p>
			If you would like to generate a new keypair before starting the game, then you can do so by
			clicking the user icon in the top right.
		</p>
	</div>
{:else}
	<div>
		<p>
			Currently logged in as {$player1.publicKey}. If you would like to use a different keypair for
			this game, then you can generate a new one by clicking the user icon in the top right.
		</p>
	</div>
{/if}

<button
	class="mx-auto m-2 p-2 rounded-lg border border-slate-800 bg-gray-200 hover:bg-gray-400"
	on:click={createGame}>Create Game</button
>
