<script lang="ts">
	import { goto } from '$app/navigation';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { dummyPlayer1, dummyPlayer2 } from '$lib/stores/sandbox/playerStore';

	const minaArenaClient = new MinaArenaClient();

	const createGame = async () => {
		const game = await minaArenaClient.createGame([dummyPlayer1, dummyPlayer2]);
		startGame(game);
	};

	const startGame = (game: Game) => {
		goto(`/sandbox/games/${game.id}`);
	};
</script>

<div class="container text-center mt-20">
	<button class="_button" on:click={createGame}>Start Game</button>
</div>
