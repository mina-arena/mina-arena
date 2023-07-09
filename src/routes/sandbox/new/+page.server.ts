import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
import { dummyPlayer1, dummyPlayer2 } from '$lib/stores/sandbox/playerStore';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const minaArenaClient = new MinaArenaClient();
	const game = await minaArenaClient.createGame([dummyPlayer1, dummyPlayer2]);
	console.log(game.id);
	throw redirect(302, `/sandbox/games/${game.id}`);
}