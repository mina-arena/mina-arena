<script lang="ts">
	import { goto } from '$app/navigation';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { error } from '$lib/stores/sandbox/errorsStore';
	import { player1, dummyPlayer, player1Default } from '$lib/stores/sandbox/playerStore';

	const isDummyPlayer = $player1.publicKey === player1Default.publicKey;
	const createGame = async () => {
		try {
			const minaArenaClient = new MinaArenaClient();
			const game = await minaArenaClient.createGame([$player1.publicKey, $dummyPlayer.publicKey]);
			console.log(game.id);
			goto(`/sandbox/games/${game.id}`);
		} catch (err) {
			$error = String(err);
		}
	};
</script>

<div class="flex-grow p-16 lg:p-24 xl:px-[30vw] mx-auto text-center text-stone-300 bg-stone-400 bg-chainmail bg-cover">
	<h1 class="font-almendra-bold text-4xl uppercase">Sandbox mode</h1>

	{#if isDummyPlayer}
		<p>
			Currently logged in as the "dummy player". This is a keypair that Mina Arena created as a
			default. You can play a round using this key, but be advised that other players will be able
			to make moves on your board as well.
		</p>
		<p>
			If you would like to generate a new keypair before starting the game, then you can do so by
			clicking the user icon in the top right.
		</p>
	{:else}
		<p class="break-break-word" style="word-break: break-word">
			Currently logged in as {$player1.publicKey}. If you would like to use a different keypair for
			this game, then you can generate a new one by clicking the user icon in the top right.
		</p>
	{/if}

	<button
			class="font-almendra-bold uppercase text-center py-4 px-5 m-2 rounded-lg home-button"
		on:click={createGame}>Create Game</button
	>
</div>
