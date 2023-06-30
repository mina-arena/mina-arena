<script lang="ts">
  import { afterUpdate, onMount } from 'svelte';
  import * as Utils from '../play/utils';
  import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
  import HoveredGamePieceTooltipShooting from './HoveredGamePieceTooltipShooting.svelte';
  import SubmitPhaseButton from './SubmitPhaseButton.svelte';

  export let game: Game;
  export let playerColors: Array<string>;
  export let rerender: () => {};

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isLoading: Boolean = false;

  let currentPlayerMinaPubKey: string = game.currentPhase?.gamePlayer.player.minaPublicKey || '';
  let gamePieces: Array<GamePiece> = game.gamePieces;
  let playerGamePieces: Array<GamePiece> = gamePieces.filter((p) => p.gamePlayer.player.minaPublicKey === currentPlayerMinaPubKey);
    
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
    initDrawnPieces();
    initGamePieceOrders();
  });

  const initDrawnPieces = () => {
    const livingGamePieces = game.gamePieces.filter((p) => p.health > 0)
    drawnPieces = livingGamePieces.map((p) => {
      const playerMinaPublicKey = p.gamePlayer.player.minaPublicKey;
      const playerColor = Utils.playerColor(playerPublicKeys, playerMinaPublicKey, playerColors);
      return Utils.makePiece(p, playerColor);
    });
  }

  const initGamePieceOrders = () => {
    orders = {};
    playerGamePieces.forEach((piece) => orders[piece.id] = []);
  };

  afterUpdate(() => {
    Utils.clearCanvas(ctx);
    drawShootingPhase(canvas, orders, selectedPiece);
    drawPieces();
  });

  const drawPieces = () => {
    Utils.drawAllPieces(canvas, ctx, drawnPieces, hoveredPiece, selectedPiece);
  }

  export const drawShootingPhase = (
    canvas: HTMLCanvasElement,
    orders: Record<string, Array<GamePieceOrder>>,
    selectedPiece?: GamePiece,
  ) => {
    const ctx = canvas.getContext('2d')!;
    if (selectedPiece) {
      const unit = selectedPiece.playerUnit.unit;
      const missileRange = unit.rangedRange || 0;

      if (missileRange) {
        Utils.drawMissileRangeCircle(ctx, orders, selectedPiece);
      }
    }

    drawShootOrders(ctx, orders);
  }

  const drawShootOrders = (
    ctx: CanvasRenderingContext2D,
    orders: Record<string, Array<GamePieceOrder>>,
  ) => {
    Object.keys(orders).forEach((gamePieceId) => {
      orders[gamePieceId].forEach((gamePieceOrder: GamePieceOrder) => {
        const rangedAttackAction = gamePieceOrder.rangedAttack;
        if (rangedAttackAction) drawRangedAttackArrow(ctx, rangedAttackAction);
      });
    });
  }

  const drawRangedAttackArrow = (
    ctx: CanvasRenderingContext2D,
    rangedAttackAction: RangedAttackAction,
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
      Utils.PIECE_RADIUS + 6,
    );
  }

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
  }

  const onMouseDown = (e: MouseEvent) => {
    if (isLoading) return;

    const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
    const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
    if (selectedPiece && clickedPiece) draftShootOrder(clickedPiece);
  }

  const onMouseUp = (e: MouseEvent) => {
    if (isLoading) return;

    const mouseCanvasPoint = Utils.getMouseCanvasPoint(e, canvas);
    const clickedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
    if (issuingOrder && clickedPiece) {
      finalizeShootOrder();
    } else {
      selectedPiece = Utils.pieceAtCanvasPoint(mouseCanvasPoint, drawnPieces, gamePieces);
    }
  }

  const draftShootOrder = (targetPiece: GamePiece) => {
    if (!selectedPiece) return;

    const selectedPiecePlayerKey = selectedPiece.gamePlayer.player.minaPublicKey;
    if (selectedPiecePlayerKey !== currentPlayerMinaPubKey) return;

    // TODO: Fetch dice rolls from dice server
    const diceRollInput = {
      publicKey: {
        x: 'publickeyx',
        y: 'publickeyy',
      },
      cipherText: 'someciphertext',
      signature: {
        r: 'signaturer',
        s: 'signatures',
      }
    }
    issuingOrder = {
      rangedAttack: {
        gamePieceId: selectedPiece.id,
        action: {
          targetGamePieceId: targetPiece.id,
          diceRoll: diceRollInput,
        }
      }
    };
    orders[selectedPiece.id] = [issuingOrder];
  }

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

    const shootDistance = Utils.distanceBetweenPoints(selectedPiece.coordinates, targetPiece.coordinates);
    if (shootDistance <= selectedPiece.playerUnit.unit.rangedRange) {
      orders[selectedPiece.id] = [issuingOrder];
    } else {
      orders[selectedPiece.id] = [];
    }
    issuingOrder = undefined;
    selectedPiece = undefined;
  }

  const submitPhase = async () => {
    const rangedAttackActions: Array<RangedAttackAction> = [];
    Object.values(orders).flat().forEach((shootOrder: GamePieceOrder) => {
      if (shootOrder.rangedAttack) rangedAttackActions.push(shootOrder.rangedAttack);
    });
    isLoading = true;
    try {
      await minaArenaClient.submitShootingPhase(
        currentPlayerMinaPubKey,
        game.id,
        game.currentPhase!.id,
        rangedAttackActions
      );
      await rerender();
    } catch(error) {
      console.log(error);
      isLoading = false;
    }
  }

  const onGamePieceHovered = (piece: GamePiece, mouseAbsolutePoint: Point) => {
    hoveredPiece = piece;
    hoveredPieceTooltipPosition = mouseAbsolutePoint;
  }

  const onGamePieceUnhovered = () => {
    hoveredPiece = undefined;
  }
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
      <SubmitPhaseButton isLoading={isLoading} submitPhaseCallback={submitPhase} />
      {#if selectedPiece}
        <div></div>
      {/if}
      {#if hoveredPiece}
        <div></div>
      {/if}
      {#if orders}
        <div></div>
      {/if}
    </div>
  </tr>
</table>
<HoveredGamePieceTooltipShooting
  game={game}
  hoveredPiece={hoveredPiece}
  selectedPiece={selectedPiece}
  tooltipAbsolutePosition={hoveredPieceTooltipPosition}
  playerPublicKeys={playerPublicKeys}
  playerColors={playerColors}
/>