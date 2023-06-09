<script lang="ts">
	import { truncateMinaPublicKey } from '$lib/utils';
	import { afterUpdate, onMount } from 'svelte';
	import * as Utils from './utils';

	export let game: Game;
	let gamePieces: Array<GamePiece> = game.gamePieces;

	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let drawnPieces: Array<DrawnPiece> = [];

	let arenaWidth: number = game.arena.width;
	let arenaHeight: number = game.arena.height;

	let hoveredPiece: GamePiece | undefined;
	let selectedPiece: GamePiece | undefined;

	const legendConfig = {
		colors: ['pink', 'lightblue']
	};

	// TODO: Can different units have different sizes?
	export const PIECE_RADIUS = 12;

	const players = game.gamePlayers?.map((p) => p.player.minaPublicKey) || ['', ''];

	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		canvasContext = canvas.getContext('2d')!;
		const livingGamePieces = game.gamePieces.filter((p) => p.health > 0)
		drawnPieces = livingGamePieces.map((p) => {
			const owner = p.gamePlayer.player.minaPublicKey;
			const ownerIdx = players?.indexOf(owner) || 0;
			return Utils.makePiece(p.id, p.coordinates.x, p.coordinates.y, PIECE_RADIUS, legendConfig.colors[ownerIdx]);
		});
	});

	afterUpdate(() => {
		Utils.drawAllPieces(canvas, canvasContext, drawnPieces, hoveredPiece, selectedPiece);
	});

	const onMouseMove = (e: MouseEvent) => {
		const mouseAbsolutePoint = { x: e.clientX, y: e.clientY };
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		hoveredPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (hoveredPiece) {
			showHoveredPieceTooltip(mouseAbsolutePoint);
		} else {
			hideHoveredPieceTooltip();
		}
	}

	const onMouseUp = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		selectedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
	}

	const showHoveredPieceTooltip = (absolutePoint: Point) => {
		var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
		if (!tooltip) return;
		
		tooltip.style.left = (absolutePoint.x + 20) + 'px';
		tooltip.style.top = (absolutePoint.y + 20) + 'px';
		tooltip.style.display = 'block';
	}

	const hideHoveredPieceTooltip = () => {
		var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
		if (!tooltip) return;
		
		tooltip.style.display = 'none';
	}
</script>

<div class="flex">
	<canvas
		id="canvas"
		width={arenaWidth}
		height={arenaHeight}
		class="border border-slate-400 mx-auto"
		on:mousemove={onMouseMove}
    on:mouseup={onMouseUp}
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
	<span id="piece-hover-tooltip">
		{#if hoveredPiece}
			{@const hoveredUnit = hoveredPiece.playerUnit.unit}
			<div>{hoveredPiece.playerUnit.name} ({hoveredUnit.name})</div>
			<div>HP: {hoveredPiece.health}/{hoveredUnit.maxHealth}</div>
			<div>Speed: {hoveredUnit.movementSpeed}</div>
			<div>Armor: {hoveredUnit.armorSaveRoll}+</div>
			{#if hoveredUnit.rangedNumAttacks}
				<div>Missile Range: {hoveredUnit.rangedRange}</div>
			{/if}
			{#if selectedPiece}
				<div></div>
			{/if}
		{/if}
	</span>
</div>
