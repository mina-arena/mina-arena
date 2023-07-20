<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import * as Utils from '../../play/utils';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import HoveredGamePieceTooltipMovement from '../tooltip/HoveredGamePieceTooltipMovement.svelte';
	import SubmitPhaseButton from '../SubmitPhaseButton.svelte';
	import { player1, dummyPlayer } from '$lib/stores/sandbox/playerStore';

	export let game: Game;
	export let playerColors: Array<string>;
	export let rerender: () => {};

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let isLoading: Boolean = false;

	let currentPlayerMinaPubKey: string = game.currentPhase?.gamePlayer.player.minaPublicKey || '';
	let gamePieces: Array<GamePiece> = game.gamePieces;
	let playerGamePieces: Array<GamePiece> = gamePieces.filter(
		(p) => p.gamePlayer.player.minaPublicKey === currentPlayerMinaPubKey
	);

	let drawnPieces: Array<DrawnPiece> = [];
	let hoveredPiece: GamePiece | undefined;
	let selectedPiece: GamePiece | undefined;
	let hoveredPieceTooltipPosition: Point | undefined;

	let orders: Record<string, Array<GamePieceOrder>>;
	let issuingOrder: GamePieceOrder | undefined;

	const MOVEMENT_CIRCLE_FILL_COLOR = 'lightgoldenrodyellow';
	const MOVEMENT_CIRCLE_STROKE_COLOR = 'goldenrod';
	const MOVEMENT_ARROW_COLOR = 'black';

	const minaArenaClient = new MinaArenaClient();
	const playerPublicKeys = (game.gamePlayers || []).map((p) => p.player.minaPublicKey) || ['', ''];

	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		Utils.drawArenaBackground(ctx);
		initDrawnPieces();
		initGamePieceOrders();
		Utils.loadGamePieceImages(gamePieces);
		Utils.loadArenaBackgroundImage(onUpdate);
	});

	const initDrawnPieces = () => {
		const livingGamePieces = game.gamePieces.filter((p) => p.health > 0);
		drawnPieces = livingGamePieces.map((p) => {
			const playerMinaPublicKey = p.gamePlayer.player.minaPublicKey;
			const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, playerColors);
			return Utils.makePiece(p, playerColor);
		});
	};

	const initGamePieceOrders = () => {
		orders = {};
		playerGamePieces.forEach((piece) => (orders[piece.id] = []));
	};

	const onUpdate = () => {
		Utils.clearCanvas(ctx);
		Utils.drawArenaBackground(ctx);
		drawMovementPhase(canvas, orders, selectedPiece);
		drawPieces();
	};

	afterUpdate(onUpdate);

	const drawPieces = () => {
		Utils.drawAllPieces(canvas, ctx, drawnPieces, hoveredPiece, selectedPiece);
	};

	export const drawMovementPhase = (
		canvas: HTMLCanvasElement,
		orders: Record<string, Array<GamePieceOrder>>,
		selectedPiece?: GamePiece
	) => {
		const ctx = canvas.getContext('2d')!;
		if (selectedPiece) {
			const unit = selectedPiece.playerUnit.unit;
			const moveSpeed = unit.movementSpeed;
			const missileRange = unit.rangedRange || 0;

			// NOTE: Assuming movement range is always greater than melee range
			// Draw largest range circles first, then smaller ones on top
			if (!missileRange) {
				drawMovementCircle(ctx, selectedPiece);
			} else {
				if (moveSpeed > missileRange) {
					drawMovementCircle(ctx, selectedPiece);
					Utils.drawMissileRangeCircle(ctx, orders, selectedPiece);
				} else {
					Utils.drawMissileRangeCircle(ctx, orders, selectedPiece);
					drawMovementCircle(ctx, selectedPiece);
				}
			}
			Utils.drawMeleeRangeCircle(ctx, orders, selectedPiece);
		}

		drawMoveOrders(ctx, orders);
	};

	const drawMovementCircle = (ctx: CanvasRenderingContext2D, selectedPiece: GamePiece) => {
		if (!selectedPiece) return;

		ctx.beginPath();
		const radius = selectedPiece.playerUnit.unit.movementSpeed;
		ctx.lineWidth = 1;
		ctx.strokeStyle = MOVEMENT_CIRCLE_STROKE_COLOR;
		const fill = Utils.hexToRgb(MOVEMENT_CIRCLE_FILL_COLOR) || { r: 255, g: 255, b: 255 };
		ctx.fillStyle = `rgba(${fill.r}, ${fill.g}, ${fill.b}, 0.2)`;
		ctx.arc(
			selectedPiece.coordinates.x,
			selectedPiece.coordinates.y,
			radius,
			0,
			2 * Math.PI,
			false
		);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	};

	const drawMoveOrders = (
		ctx: CanvasRenderingContext2D,
		orders: Record<string, Array<GamePieceOrder>>
	) => {
		Object.keys(orders).forEach((gamePieceId) => {
			orders[gamePieceId].forEach((gamePieceOrder: GamePieceOrder) => {
				const moveAction = gamePieceOrder.move;
				if (moveAction) drawMovementArrow(ctx, moveAction);
			});
		});
	};

	const drawMovementArrow = (ctx: CanvasRenderingContext2D, moveAction: MoveAction) => {
		Utils.drawArrow(
			ctx,
			moveAction.action.moveFrom,
			moveAction.action.moveTo,
			MOVEMENT_ARROW_COLOR
		);
	};

	const onMouseMove = (e: MouseEvent) => {
		const mouseAbsolutePoint = { x: e.clientX, y: e.clientY };
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		hoveredPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (hoveredPiece) {
			onGamePieceHovered(hoveredPiece, mouseAbsolutePoint);
		} else {
			onGamePieceUnhovered();
		}
		if (issuingOrder) draftMoveOrder(mouseCanvasPoint);
	};

	const onMouseDown = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (selectedPiece && !clickedPiece) draftMoveOrder(mouseCanvasPoint);
	};

	const onMouseUp = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		if (issuingOrder) {
			finalizeMoveOrder();
		} else {
			selectedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		}
	};

	const draftMoveOrder = (canvasPoint: Point) => {
		if (!selectedPiece) return;

		const selectedPiecePlayerKey = selectedPiece.gamePlayer.player.minaPublicKey;
		if (selectedPiecePlayerKey !== currentPlayerMinaPubKey) return;

		issuingOrder = {
			move: {
				gamePieceId: selectedPiece.id,
				action: {
					moveFrom: { x: selectedPiece.coordinates.x, y: selectedPiece.coordinates.y },
					moveTo: { x: Math.round(canvasPoint.x), y: Math.round(canvasPoint.y) },
					gamePieceNumber: selectedPiece.gamePieceNumber
				}
			}
		};
		orders[selectedPiece.id] = [issuingOrder];
	};

	const finalizeMoveOrder = () => {
		if (!selectedPiece || !issuingOrder || !issuingOrder.move) {
			issuingOrder = undefined;
			selectedPiece = undefined;
			return;
		}

		const moveDistance = Utils.distanceBetweenPoints(
			selectedPiece.coordinates,
			issuingOrder.move?.action.moveTo
		);
		if (moveDistance <= selectedPiece.playerUnit.unit.movementSpeed) {
			orders[selectedPiece.id] = [issuingOrder];
		} else {
			orders[selectedPiece.id] = [];
		}
		issuingOrder = undefined;
		selectedPiece = undefined;
	};

	const submitPhase = async () => {
		const moveActions: Array<MoveAction> = [];
		Object.values(orders)
			.flat()
			.forEach((moveOrder: GamePieceOrder) => {
				if (moveOrder.move) moveActions.push(moveOrder.move);
			});
		isLoading = true;
		const player = currentPlayerMinaPubKey === $player1.publicKey ? $player1 : $dummyPlayer;
		await minaArenaClient.submitMovePhase(
			player.publicKey,
			game.id,
			game.currentPhase!.id,
			moveActions,
			player.privateKey
		);
		await rerender();
	};

	const onGamePieceHovered = (piece: GamePiece, mouseAbsolutePoint: Point) => {
		hoveredPiece = piece;
		hoveredPieceTooltipPosition = mouseAbsolutePoint;
	};

	const onGamePieceUnhovered = () => {
		hoveredPiece = undefined;
	};
</script>

<table>
	<tr>
		<canvas
			id="canvas"
			width={game.arena.width}
			height={game.arena.height}
			class="border border-slate-400 mx-auto"
			on:mousemove={onMouseMove}
			on:mousedown={onMouseDown}
			on:mouseup={onMouseUp}
		/>
	</tr>
	<tr>
		<div class="flex">
			<SubmitPhaseButton {isLoading} submitPhaseCallback={submitPhase} />
			{#if selectedPiece}
				<div />
			{/if}
			{#if hoveredPiece}
				<div />
			{/if}
			{#if orders}
				<div />
			{/if}
		</div>
	</tr>
</table>
<HoveredGamePieceTooltipMovement
	{hoveredPiece}
	tooltipAbsolutePosition={hoveredPieceTooltipPosition}
	{playerPublicKeys}
	{playerColors}
/>
