<script lang="ts">
	import { onMount } from 'svelte';
	import { squads } from '$lib/stores/sandbox/squadStore';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { page } from '$app/stores';

	import { makePiece, drawAllPieces } from './utils';

	const minaArenaClient = new MinaArenaClient();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let pieces: Array<DrawnPiece> = [];

	let arenaWidth: number = 1;
	let arenaHeight: number = 1;

	let offsetTop: number;
	let offsetLeft: number;

	const player1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
	const player2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';

	let currentGame: Game = { id: Number($page.params.gameId) };

	onMount(async () => {
		const game: Game = await minaArenaClient.getGame(currentGame.id);
		console.log(game);
		arenaWidth = game.arena?.width || 0;
		arenaHeight = game.arena?.height || 0;
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;

		offsetTop = canvas.offsetTop;
		offsetLeft = canvas.offsetLeft;

		let i = 10;
		$squads[player1].playerUnits.forEach((unit) => {
			makePiece(i, 30, 50, 25, 'skyblue');
			i += 85;
		});

		i = 10;
		$squads[player2].playerUnits.forEach((unit) => {
			makePiece(i, 500, 50, 25, 'pink');
			i += 85;
		});
		drawAllPieces(canvas, ctx, pieces);
	});

	const refreshGame = async () => {
		const game: Game = await minaArenaClient.getGame(currentGame.id);
		currentGame = game;
	};
</script>

{#if arenaHeight && arenaWidth}
	<canvas
		id="canvas"
		width={arenaWidth}
		height={arenaHeight}
		class="border border-slate-400 mx-auto"
	/>
{/if}
