<script lang="ts">
	import { truncateMinaPublicKey } from '$lib/utils';
	import { afterUpdate } from 'svelte';
	import { makePiece, drawAllPieces } from './utils';

	export let game: Game;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let pieces: Array<DrawnPiece> = [];

	let offsetTop: number;
	let offsetLeft: number;

	const legendConfig = {
		colors: ['pink', 'lightblue']
	};

	const players = game.gamePlayers?.map((p) => p.player.minaPublicKey) || ['', ''];

	afterUpdate(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		offsetTop = canvas.offsetTop;
		offsetLeft = canvas.offsetLeft;
		pieces =
			game.gamePieces?.map((p) => {
				const owner = p.gamePlayer.player.minaPublicKey;
				const ownerIdx = players?.indexOf(owner) || 0;
				return makePiece(p.coordinates.x, p.coordinates.y, 20, 20, legendConfig.colors[ownerIdx]);
			}) || [];
		console.log(pieces);
		drawAllPieces(canvas, ctx, pieces);
	});
</script>

<div class="flex">
	<canvas
		id="canvas"
		width={game.arena?.width}
		height={game.arena?.height}
		class="border border-slate-400 mx-auto"
	/>
	<div class="mr-6">
		<div>Legend:</div>
		<br />
		<div>
			<div>
				<div class="w-3 h-3 bg-[pink] border border-zinc-600" />
				Player 1: {truncateMinaPublicKey(players[0])}
			</div>
		</div>
		<br />
		<div>
			<div class="w-3 h-3 bg-[lightblue] border border-zinc-600" />
			Player 2: {truncateMinaPublicKey(players[1])}
		</div>
	</div>
</div>
