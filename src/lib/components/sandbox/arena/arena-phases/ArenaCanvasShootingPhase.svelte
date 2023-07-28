<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import * as Utils from '../../play/utils';
	import { DiceRollServiceClient } from '$lib/dice-service-client/DiceRollServiceClient';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import HoveredGamePieceTooltipShooting from '../tooltip/HoveredGamePieceTooltipShooting.svelte';
	import SubmitPhaseButton from '../SubmitPhaseButton.svelte';
	import { player1, dummyPlayer } from '$lib/stores/sandbox/playerStore';
	import { error } from '$lib/stores/sandbox/errorsStore';

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

	const SHOOTING_ARROW_COLOR = 'darkred';

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
		drawShootingPhaseUnderPieces(canvas, orders, selectedPiece);
		drawPieces();
		drawShootOrders(ctx, orders);
	};

	afterUpdate(onUpdate);

	const drawPieces = () => {
		Utils.drawAllPieces(canvas, ctx, drawnPieces, hoveredPiece, selectedPiece);
	};

	export const drawShootingPhaseUnderPieces = (
		canvas: HTMLCanvasElement,
		orders: Record<string, Array<GamePieceOrder>>,
		selectedPiece?: GamePiece
	) => {
		const ctx = canvas.getContext('2d')!;
		if (selectedPiece) {
			const unit = selectedPiece.playerUnit.unit;
			const missileRange = unit.rangedRange || 0;

			if (missileRange) {
				Utils.drawMissileRangeCircle(ctx, orders, selectedPiece);
			}
		}
	};

	const drawShootOrders = (
		ctx: CanvasRenderingContext2D,
		orders: Record<string, Array<GamePieceOrder>>
	) => {
		Object.keys(orders).forEach((gamePieceId) => {
			orders[gamePieceId].forEach((gamePieceOrder: GamePieceOrder) => {
				const rangedAttackAction = gamePieceOrder.rangedAttack;
				if (rangedAttackAction) drawRangedAttackArrow(ctx, rangedAttackAction);
			});
		});
	};

	const drawRangedAttackArrow = (
		ctx: CanvasRenderingContext2D,
		rangedAttackAction: RangedAttackAction
	) => {
		const shootingPieceId = rangedAttackAction.gamePieceId;
		const targetPieceId = rangedAttackAction.action.targetGamePieceId;
		const shootingPiece = Utils.gamePieceById(shootingPieceId, gamePieces);
		const targetPiece = Utils.gamePieceById(targetPieceId, gamePieces);

		if (!shootingPiece) {
			console.log(`ERROR drawing shooting orders, no GamePiece found with ID ${shootingPieceId}`);
			return;
		}

		if (!targetPiece) {
			console.log(`ERROR drawing shooting orders, no GamePiece found with ID ${targetPieceId}`);
			return;
		}

		Utils.drawArrowWithOffset(
			ctx,
			shootingPiece.coordinates,
			targetPiece.coordinates,
			SHOOTING_ARROW_COLOR,
			Utils.PIECE_RADIUS - 4
		);
	};

	const onMouseMove = (e: MouseEvent) => {
		const mouseAbsolutePoint = { x: e.clientX, y: e.clientY };
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		hoveredPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (hoveredPiece) {
			onGamePieceHovered(hoveredPiece, mouseAbsolutePoint);
			if (issuingOrder) draftShootOrder(hoveredPiece);
		} else {
			onGamePieceUnhovered();
		}
	};

	const onMouseDown = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (selectedPiece && clickedPiece) draftShootOrder(clickedPiece);
	};

	const onMouseUp = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (issuingOrder && clickedPiece) {
			finalizeShootOrder();
		} else {
			selectedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		}
	};

	const draftShootOrder = (targetPiece: GamePiece) => {
		if (!selectedPiece) return;

		// Validate that the selected piece is owned by the
		// active player, and the target piece is not.
		const selectedPiecePlayerKey = selectedPiece.gamePlayer.player.minaPublicKey;
		const targetPiecePlayerKey = targetPiece.gamePlayer.player.minaPublicKey;
		if (
			selectedPiecePlayerKey !== currentPlayerMinaPubKey ||
			targetPiecePlayerKey === currentPlayerMinaPubKey
		) {
			return;
		}

		// Validate that the selected piece can make ranged attacks and is in range
		const selectedUnit = selectedPiece.playerUnit.unit;
		if (!selectedUnit.rangedNumAttacks || !selectedUnit.rangedRange) return;

		const shootDistance = Utils.distanceBetweenPoints(
			selectedPiece.coordinates,
			targetPiece.coordinates
		);
		if (shootDistance > selectedUnit.rangedRange) return;

		const placeholderDiceRoll = {
			publicKey: {
				x: '',
				y: ''
			},
			cipherText: '',
			signature: {
				r: '',
				s: ''
			}
		};
		issuingOrder = {
			rangedAttack: {
				gamePieceId: selectedPiece.id,
				action: {
					targetGamePieceId: targetPiece.id,
					diceRolls: placeholderDiceRoll,
					gamePieceNumber: selectedPiece.gamePieceNumber,
					targetGamePieceNumber: targetPiece.gamePieceNumber
				}
			}
		};
		orders[selectedPiece.id] = [issuingOrder];
	};

	const finalizeShootOrder = () => {
		if (
			!selectedPiece ||
			!issuingOrder ||
			!issuingOrder.rangedAttack ||
			!selectedPiece.playerUnit.unit.rangedRange
		) {
			issuingOrder = undefined;
			selectedPiece = undefined;
			return;
		}

		const targetPieceId = issuingOrder.rangedAttack.action.targetGamePieceId;
		const targetPiece = Utils.gamePieceById(targetPieceId, gamePieces);

		if (!targetPiece || targetPiece.gamePlayer.player.minaPublicKey === currentPlayerMinaPubKey) {
			issuingOrder = undefined;
			selectedPiece = undefined;
			return;
		}

		const shootDistance = Utils.distanceBetweenPoints(
			selectedPiece.coordinates,
			targetPiece.coordinates
		);
		if (shootDistance <= selectedPiece.playerUnit.unit.rangedRange) {
			orders[selectedPiece.id] = [issuingOrder];
		} else {
			orders[selectedPiece.id] = [];
		}
		issuingOrder = undefined;
		selectedPiece = undefined;
	};

	const submitPhase = async () => {
		const rangedAttackActions: Array<RangedAttackAction> = [];

		let isError = false;
		isLoading = true;
		await Promise.all(
			Object.values(orders)
				.flat()
				.map(async (shootOrder: GamePieceOrder) => {
					if (!shootOrder.rangedAttack) return;
					const attackingPieceId = shootOrder.rangedAttack.gamePieceId;
					const attackingPiece = Utils.gamePieceById(attackingPieceId, gamePieces);
					const attackingUnit = attackingPiece?.playerUnit.unit;
					const numAttacks = attackingUnit?.rangedNumAttacks || 1;
					console.log(
						`Rolling for ${numAttacks} attacks from Piece ${attackingPiece?.playerUnit.name} (ID: ${attackingPieceId})`
					);
					for (let i = 0; i < numAttacks; i++) {
						if (!shootOrder.rangedAttack) return;
						const diceRoll = await rollDiceForAttack();
						if (!diceRoll) {
							orders = {};
							isError = true;
							return;
						}
						let attack = JSON.parse(JSON.stringify(shootOrder.rangedAttack));
						attack.action.diceRolls = diceRoll;
						rangedAttackActions.push(attack);
					}
				})
		);
		if (isError) {
			return rerender();
		}
		const player = currentPlayerMinaPubKey === $player1.publicKey ? $player1 : $dummyPlayer;
		try {
			await minaArenaClient.submitShootingPhase(
				player.publicKey,
				game.id,
				game.currentPhase!.id,
				rangedAttackActions,
				player.privateKey
			);
		} catch (err) {
			$error = String(err);
		}
		rerender();
	};

	const rollDiceForAttack = async () => {
		try {
			return await new DiceRollServiceClient().getDiceRolls();
		} catch (err) {
			$error = String(err);
		}
	};

	const onGamePieceHovered = (piece: GamePiece, mouseAbsolutePoint: Point) => {
		hoveredPiece = piece;
		hoveredPieceTooltipPosition = mouseAbsolutePoint;
	};

	const onGamePieceUnhovered = () => {
		hoveredPiece = undefined;
	};
</script>

<div class="flex-grow flex justify-center items-center">
	<canvas
			id="canvas"
			width={game.arena.width}
			height={game.arena.height}
			class="mx-auto drop-shadow-lg rounded-2xl border-[10px] border-stone-800"
			on:mousemove={onMouseMove}
			on:mousedown={onMouseDown}
			on:mouseup={onMouseUp}
		/>
</div>
<div class="flex absolute">
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
<HoveredGamePieceTooltipShooting
	{game}
	{hoveredPiece}
	{selectedPiece}
	tooltipAbsolutePosition={hoveredPieceTooltipPosition}
	{playerPublicKeys}
	{playerColors}
/>
