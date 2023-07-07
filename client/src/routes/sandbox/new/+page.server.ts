import { redirect } from '@sveltejs/kit';
import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
import { dummyPlayer1, dummyPlayer2 } from '$lib/stores/sandbox/playerStore';

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const minaArenaClient = new MinaArenaClient();
  return {
    game: Promise.resolve(minaArenaClient.createGame([dummyPlayer1, dummyPlayer2])),
  };
}