<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import * as Utils from '../../play/utils';
	import { DiceRollServiceClient } from '$lib/dice-service-client/DiceRollServiceClient';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import HoveredGamePieceTooltipMelee from '../tooltip/HoveredGamePieceTooltipMelee.svelte';
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

	const MELEE_ARROW_COLOR = 'darkred';

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
		drawPieces();
		drawMeleePhase(canvas, orders, selectedPiece);
	};

	afterUpdate(onUpdate);

	const drawPieces = () => {
		Utils.drawAllPieces(canvas, ctx, drawnPieces, hoveredPiece, selectedPiece);
	};

	export const drawMeleePhase = (
		canvas: HTMLCanvasElement,
		orders: Record<string, Array<GamePieceOrder>>,
		selectedPiece?: GamePiece
	) => {
		const ctx = canvas.getContext('2d')!;
		if (selectedPiece) {
			Utils.drawMeleeRangeCircle(ctx, orders, selectedPiece);
		}

		drawMeleeOrders(ctx, orders);
	};

	const drawMeleeOrders = (
		ctx: CanvasRenderingContext2D,
		orders: Record<string, Array<GamePieceOrder>>
	) => {
		Object.keys(orders).forEach((gamePieceId) => {
			orders[gamePieceId].forEach((gamePieceOrder: GamePieceOrder) => {
				const meleeAttackAction = gamePieceOrder.meleeAttack;
				if (meleeAttackAction) drawMeleeAttackArrow(ctx, meleeAttackAction);
			});
		});
	};

	const drawMeleeAttackArrow = (
		ctx: CanvasRenderingContext2D,
		meleeAttackAction: MeleeAttackAction
	) => {
		const attackingPieceId = meleeAttackAction.gamePieceId;
		const targetPieceId = meleeAttackAction.action.targetGamePieceId;
		const attackingPiece = Utils.gamePieceById(attackingPieceId, gamePieces);
		const targetPiece = Utils.gamePieceById(targetPieceId, gamePieces);

		if (!attackingPiece) {
			console.log(`ERROR drawing melee orders, no GamePiece found with ID ${attackingPieceId}`);
			return;
		}

		if (!targetPiece) {
			console.log(`ERROR drawing melee orders, no GamePiece found with ID ${targetPieceId}`);
			return;
		}

		Utils.drawArrowWithOffset(
			ctx,
			attackingPiece.coordinates,
			targetPiece.coordinates,
			MELEE_ARROW_COLOR,
			Utils.PIECE_RADIUS - 4
		);
	};

	const onMouseMove = (e: MouseEvent) => {
		const mouseAbsolutePoint = { x: e.clientX, y: e.clientY };
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		hoveredPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (hoveredPiece) {
			onGamePieceHovered(hoveredPiece, mouseAbsolutePoint);
			if (issuingOrder) draftMeleeOrder(hoveredPiece);
		} else {
			onGamePieceUnhovered();
		}
	};

	const onMouseDown = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (selectedPiece && clickedPiece) draftMeleeOrder(clickedPiece);
	};

	const onMouseUp = (e: MouseEvent) => {
		const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
		const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		if (issuingOrder && clickedPiece) {
			finalizeMeleeOrder();
		} else {
			selectedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
		}
	};

	const draftMeleeOrder = (targetPiece: GamePiece) => {
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

		// Validate that the selected piece is in range
		const attackDistance = Utils.distanceBetweenPoints(
			selectedPiece.coordinates,
			targetPiece.coordinates
		);
		if (attackDistance > Utils.MELEE_ATTACK_RANGE) return;

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
			meleeAttack: {
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

	const finalizeMeleeOrder = () => {
		if (!selectedPiece || !issuingOrder || !issuingOrder.meleeAttack) {
			issuingOrder = undefined;
			selectedPiece = undefined;
			return;
		}

		const targetPieceId = issuingOrder.meleeAttack.action.targetGamePieceId;
		const targetPiece = Utils.gamePieceById(targetPieceId, gamePieces);

		if (!targetPiece || targetPiece.gamePlayer.player.minaPublicKey === currentPlayerMinaPubKey) {
			issuingOrder = undefined;
			selectedPiece = undefined;
			return;
		}

		const attackDistance = Utils.distanceBetweenPoints(
			selectedPiece.coordinates,
			targetPiece.coordinates
		);
		if (attackDistance <= Utils.MELEE_ATTACK_RANGE) {
			orders[selectedPiece.id] = [issuingOrder];
		} else {
			orders[selectedPiece.id] = [];
		}
		issuingOrder = undefined;
		selectedPiece = undefined;
	};

	const submitPhase = async () => {
		const meleeAttackActions: Array<MeleeAttackAction> = [];
		let isError = false;
		await Promise.all(
			Object.values(orders)
				.flat()
				.map(async (meleeOrder: GamePieceOrder) => {
					if (!meleeOrder.meleeAttack) return;
					const attackingPieceId = meleeOrder.meleeAttack.gamePieceId;
					const attackingPiece = Utils.gamePieceById(attackingPieceId, gamePieces);
					const attackingUnit = attackingPiece?.playerUnit.unit;
					const numAttacks = attackingUnit?.meleeNumAttacks || 1;
					console.log(
						`Rolling for ${numAttacks} attacks from Piece ${attackingPiece?.playerUnit.name} (ID: ${attackingPieceId})`
					);
					for (let i = 0; i < numAttacks; i++) {
						if (!meleeOrder.meleeAttack) return;
						console.log('Rolling Dice...');
						const diceRoll = await rollDiceForAttack();
						console.log('Roll: ', diceRoll);
						if (!diceRoll) {
							orders = {};
							isError = true;
							return;
						}
						let attack = JSON.parse(JSON.stringify(meleeOrder.meleeAttack));
						attack.action.diceRolls = diceRoll;
						meleeAttackActions.push(attack);
					}
				})
		);
		if (isError) {
			return rerender();
		}
		isLoading = true;
		const player = currentPlayerMinaPubKey === $player1.publicKey ? $player1 : $dummyPlayer;
		try {
			await minaArenaClient.submitMeleePhase(
				player.publicKey,
				game.id,
				game.currentPhase!.id,
				meleeAttackActions,
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
<HoveredGamePieceTooltipMelee
	{game}
	{hoveredPiece}
	{selectedPiece}
	tooltipAbsolutePosition={hoveredPieceTooltipPosition}
	{playerPublicKeys}
	{playerColors}
/>
