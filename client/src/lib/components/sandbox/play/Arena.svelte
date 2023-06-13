<script lang="ts">
	import { truncateMinaPublicKey } from '$lib/utils';
	import { afterUpdate, onMount } from 'svelte';
	import * as Utils from './utils';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';

	import { drawMovementPhase } from './phases/movement-phase';

	export let game: Game;
	let currentPlayerMinaPubKey: string = game.currentPhase?.gamePlayer.player.minaPublicKey || '';
	let currentPhaseName: string | undefined = game.currentPhase?.name;
	let gamePieces: Array<GamePiece> = game.gamePieces;
	let playerGamePieces: Array<GamePiece> = gamePieces.filter((p) => p.gamePlayer.player.minaPublicKey === currentPlayerMinaPubKey)

	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let drawnPieces: Array<DrawnPiece> = [];

	let arenaWidth: number = game.arena.width;
	let arenaHeight: number = game.arena.height;

	let hoveredPiece: GamePiece | undefined;
	let selectedPiece: GamePiece | undefined;

	let orders: Record<string, Array<GamePieceOrder>>;
	let issuingOrder: GamePieceOrder | undefined;
	const minaArenaClient = new MinaArenaClient();

	const legendConfig = {
		colors: ['pink', 'lightblue']
	};

	// TODO: Can different units have different sizes?
	export const PIECE_RADIUS = 12;

	const PHASE_NAME_MOVEMENT = 'MOVEMENT';
	const PHASE_NAME_SHOOTING = 'SHOOTING';
	const PHASE_NAME_MELEE = 'MELEE';

	const playerPublicKeys = (game.gamePlayers || []).map((p) => p.player.minaPublicKey) || ['', ''];

	export let rerender: () => {};

	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		canvasContext = canvas.getContext('2d')!;
		initDrawnPieces();
		initGamePieceOrders();
	});

	const initDrawnPieces = () => {
		const livingGamePieces = game.gamePieces.filter((p) => p.health > 0)
		drawnPieces = livingGamePieces.map((p) => {
			const playerMinaPublicKey = p.gamePlayer.player.minaPublicKey;
			const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, legendConfig.colors);
			return Utils.makePiece(p.id, p.coordinates.x, p.coordinates.y, PIECE_RADIUS, playerColor);
		});
	}

	const initGamePieceOrders = () => {
		orders = {};
		playerGamePieces.forEach((piece) => orders[piece.id] = []);
	}

	afterUpdate(() => {
		clearCanvas();
		drawPhaseBeforePieces();
		drawPieces();
	});

	const clearCanvas = () => {
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	}

	const drawPhaseBeforePieces = () => {
		switch(currentPhaseName) {
			case PHASE_NAME_MOVEMENT:
				drawMovementPhase(canvas, orders, selectedPiece);
				break;
		}
	}

	const drawPieces = () => {
		Utils.drawAllPieces(canvas, canvasContext, drawnPieces, hoveredPiece, selectedPiece);
	}

	const onMouseMove = (e: MouseEvent) => {
		const mouseAbsolutePoint = { x: e.clientX, y: e.clientY };
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		hoveredPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (hoveredPiece) {
			showHoveredPieceTooltip(mouseAbsolutePoint, hoveredPiece);
		} else {
			hideHoveredPieceTooltip();
		}
		if (issuingOrder) {
			switch(currentPhaseName) {
				case PHASE_NAME_MOVEMENT:
					draftMoveOrder(mouseCanvasPoint);
					break;
			}
		}
	}

	const onMouseDown = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		switch(currentPhaseName) {
			case PHASE_NAME_MOVEMENT:
				if (!clickedPiece) draftMoveOrder(mouseCanvasPoint);
				break;
		}
	}

	const onMouseUp = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		if (issuingOrder) {
			switch(currentPhaseName) {
				case PHASE_NAME_MOVEMENT:
					finalizeMoveOrder();
					break;
			}
		} else {
			selectedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		}
	}

	const showHoveredPieceTooltip = (absolutePoint: Point, hoveredPiece: GamePiece) => {
		var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
		if (!tooltip) return;

		const playerMinaPublicKey = hoveredPiece.gamePlayer.player.minaPublicKey;
		const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, legendConfig.colors);
		
		tooltip.style.left = (absolutePoint.x + 20) + 'px';
		tooltip.style.top = (absolutePoint.y + 20) + 'px';
		tooltip.style.display = 'block';
		tooltip.style.backgroundColor = playerColor;
	}

	const hideHoveredPieceTooltip = () => {
		var tooltip = document.querySelector('#piece-hover-tooltip') as HTMLElement;
		if (!tooltip) return;
		
		tooltip.style.display = 'none';
	}

	const draftMoveOrder = (canvasPoint: Point) => {
		if (!selectedPiece) return;

		issuingOrder = {
			move: {
				gamePieceId: selectedPiece.id,
				action: {
					moveFrom: { x: selectedPiece.coordinates.x, y: selectedPiece.coordinates.y },
					moveTo: { x: Math.round(canvasPoint.x), y: Math.round(canvasPoint.y) }
				}
			}
		};
		orders[selectedPiece.id] = [issuingOrder];
	}

	const finalizeMoveOrder = () => {
		if (!selectedPiece || !issuingOrder || !issuingOrder.move) {
			issuingOrder = undefined;
			selectedPiece = undefined;
			return;
		}

		const moveDistance = Utils.distanceBetweenPoints(selectedPiece.coordinates, issuingOrder.move?.action.moveTo);
		if (moveDistance <= selectedPiece.playerUnit.unit.movementSpeed) {
			orders[selectedPiece.id] = [issuingOrder];
		} else {
			orders[selectedPiece.id] = [];
		}
		issuingOrder = undefined;
		selectedPiece = undefined;
	}

	const submitPhase = async () => {
		switch(currentPhaseName) {
			case 'MOVEMENT':
				await submitMovePhase();
				break;
			case 'SHOOTING':
				await submitShootingPhase();
				break;
			case 'MELEE':
				await submitMeleePhase();
				break;
		}
		await rerender();
	}

	const submitMovePhase = async () => {
		const moveActions: Array<MoveAction> = [];
		Object.values(orders).flat().forEach((moveOrder: GamePieceOrder) => {
			if (moveOrder.move) moveActions.push(moveOrder.move);
		});
		await minaArenaClient.submitMovePhase(
			currentPlayerMinaPubKey,
			game.id,
			game.currentPhase!.id,
			moveActions
		);
	}

	const submitShootingPhase = async () => {
		await minaArenaClient.submitShootingPhase(
			currentPlayerMinaPubKey,
			game.id,
			game.currentPhase!.id,
			[]
		);
	}

	const submitMeleePhase = async () => {
		await minaArenaClient.submitMeleePhase(
			currentPlayerMinaPubKey,
			game.id,
			game.currentPhase!.id,
			[]
		);
	}
</script>

<div class="flex">
	<canvas
		id="canvas"
		width={arenaWidth}
		height={arenaHeight}
		class="border border-slate-400 mx-auto"
		on:mousemove={onMouseMove}
		on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
	/>
	<div class="mr-6">
		<div>Legend:</div>
		<br />
		<div>
			<div>
				<div class="w-3 h-3 bg-[pink] border border-zinc-600" />
				Player 1: {truncateMinaPublicKey(playerPublicKeys[0])}
			</div>
		</div>
		<br />
		<div>
			<div class="w-3 h-3 bg-[lightblue] border border-zinc-600" />
			Player 2: {truncateMinaPublicKey(playerPublicKeys[1])}
		</div>
	</div>
	<span id="piece-hover-tooltip" class="p-2 hidden fixed overflow-hidden border border-solid border-black rounded">
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
			{#if orders}
				<div></div>
			{/if}
		{/if}
	</span>
</div>
<div class="flex">
	<button
		id="submit-phase-button"
		class="mx-auto p-2 rounded-xl bg-gray-200 hover:bg-gray-400"
		on:click={submitPhase}
	>
		Submit Phase
	</button>
</div>
