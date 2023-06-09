import { drawArrow } from "../utils";

const MOVEMENT_CIRCLE_FILL_COLOR = 'lightgoldenrodyellow';
const MOVEMENT_CIRCLE_STROKE_COLOR = 'goldenrod';
const MISSILE_RANGE_CIRCLE_FILL_COLOR = '#ffe9f0';
const MISSILE_RANGE_CIRCLE_STROKE_COLOR = 'lightcoral';

export const drawMovementPhase = (
  canvas: HTMLCanvasElement,
  orders: Record<string, Array<GamePieceOrder>>,
  selectedPiece?: GamePiece,
) => {
  const ctx = canvas.getContext('2d')!;
  if (selectedPiece) {
    const unit = selectedPiece.playerUnit.unit;
    const moveSpeed = unit.movementSpeed;
    const missileRange = unit.rangedRange || 0;

    if (!missileRange) {
      drawMovementCircle(ctx, selectedPiece);
    } else {
      if (moveSpeed > missileRange) {
        // Move speed circle is larger, draw that first
        drawMovementCircle(ctx, selectedPiece);
        drawMissileRangeCircle(ctx, orders, selectedPiece);
      } else {
        // Missile range circle is larger, draw that first
        drawMissileRangeCircle(ctx, orders, selectedPiece);
        drawMovementCircle(ctx, selectedPiece);
      }
    }
  }

  drawMoveOrders(ctx, orders);
}

const drawMovementCircle = (
  ctx: CanvasRenderingContext2D,
  selectedPiece: GamePiece
) => {
  if (!selectedPiece) return;

  ctx.beginPath();
  const radius = selectedPiece.playerUnit.unit.movementSpeed;
  ctx.lineWidth = 1;
  ctx.strokeStyle = MOVEMENT_CIRCLE_STROKE_COLOR;
  ctx.fillStyle = MOVEMENT_CIRCLE_FILL_COLOR;
  ctx.arc(selectedPiece.coordinates.x, selectedPiece.coordinates.y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

const drawMissileRangeCircle = (
  ctx: CanvasRenderingContext2D,
  orders: Record<string, Array<GamePieceOrder>>,
  selectedPiece: GamePiece
) => {
  if (!selectedPiece) return;
  const unit = selectedPiece.playerUnit.unit;
  if (!unit.rangedRange) return;
  
  const selectedPieceOrders = orders[selectedPiece.id];
  let selectedPieceMovingTo: Point | undefined = undefined;
  if (selectedPieceOrders.length > 0) {
    selectedPieceMovingTo = selectedPieceOrders[0].move?.action.moveTo;
  }

  const missileRangeCircleCenter = selectedPieceMovingTo || selectedPiece.coordinates;
  
  ctx.beginPath();
  const radius = unit.rangedRange;
  ctx.lineWidth = 1;
  ctx.strokeStyle = MISSILE_RANGE_CIRCLE_STROKE_COLOR;
  ctx.fillStyle = MISSILE_RANGE_CIRCLE_FILL_COLOR;
  ctx.arc(missileRangeCircleCenter.x, missileRangeCircleCenter.y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

const drawMoveOrders = (
  ctx: CanvasRenderingContext2D,
  orders: Record<string, Array<GamePieceOrder>>,
) => {
  Object.keys(orders).forEach((gamePieceId) => {
    orders[gamePieceId].forEach((gamePieceOrder: GamePieceOrder) => {
      const moveAction = gamePieceOrder.move;
      if (moveAction) drawMovementArrow(ctx, moveAction);
    });
  });
}

const drawMovementArrow = (
  ctx: CanvasRenderingContext2D,
  moveAction: MoveAction,
) => {
  drawArrow(ctx, moveAction.action.moveFrom, moveAction.action.moveTo);
}
