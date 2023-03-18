<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import PhaseInput from '../phase-input/PhaseInput.svelte';
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
		currentGame = await minaArenaClient.getGame(currentGame.id);
		console.log(currentGame);
		arenaWidth = currentGame.arena?.width || 0;
		arenaHeight = currentGame.arena?.height || 0;
		offsetTop = canvas.offsetTop;
		offsetLeft = canvas.offsetLeft;
	});

	afterUpdate(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		pieces =
			currentGame.gamePieces?.map((p) => {
				return makePiece(p.coordinates.x, p.coordinates.y, 10, 10, 'pink');
			}) || [];
		console.log(pieces);
		drawAllPieces(canvas, ctx, pieces);
	});

	const refreshGame = async () => {
		const game: Game = await minaArenaClient.getGame(currentGame.id);
		currentGame = game;
	};
</script>

<PhaseInput game={currentGame} />
<canvas
	id="canvas"
	width={arenaWidth}
	height={arenaHeight}
	class="border border-slate-400 mx-auto"
/>
