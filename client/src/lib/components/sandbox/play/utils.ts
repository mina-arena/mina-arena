const PIECE_STROKE_COLOR = '#101010';
const PIECE_SELECTED_STROKE_COLOR = '#771111';
const MISSILE_RANGE_CIRCLE_FILL_COLOR = '#ffe9f0';
const MISSILE_RANGE_CIRCLE_STROKE_COLOR = 'lightcoral';
const MELEE_RANGE_CIRCLE_STROKE_COLOR = '#6b0000';
const MELEE_RANGE_CIRCLE_FILL_COLOR = '#ffb0b0';

export const PIECE_RADIUS = 12;
export const MELEE_ATTACK_RANGE = 50;

export const clearCanvas = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export const makePiece = (piece: GamePiece, playerColor: string) => {
  return {
    gamePieceId: piece.id,
    x: piece.coordinates.x,
    y: piece.coordinates.y,
    radius: PIECE_RADIUS,
    fill: playerColor
  };
};

export const drawAllPieces = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  pieces: Array<DrawnPiece>,
  hoveredPiece?: GamePiece,
  selectedPiece?: GamePiece
) => {
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    const isHovered = hoveredPiece?.id === piece.gamePieceId;
    const isSelected = selectedPiece?.id === piece.gamePieceId;
    
    let pieceRenderMode: PieceRenderMode = 'normal';
    if (isHovered && !selectedPiece) {
      pieceRenderMode = 'hovered';
    } else if (isSelected) {
      pieceRenderMode = 'selected';
    }

    drawPiece(ctx, piece, pieceRenderMode);
  }
};

export type PieceRenderMode = 'normal' | 'hovered' | 'selected';

export const drawPiece = (ctx: CanvasRenderingContext2D, piece: DrawnPiece, pieceRenderMode: PieceRenderMode) => {
  ctx.beginPath();
  const radius = ['hovered', 'selected'].includes(pieceRenderMode) ? piece.radius + 2 : piece.radius;
  ctx.lineWidth = pieceRenderMode === 'selected' ? 1.5 : 1;
  ctx.strokeStyle = pieceRenderMode === 'selected' ? PIECE_SELECTED_STROKE_COLOR : PIECE_STROKE_COLOR;
  ctx.fillStyle = piece.fill;
  ctx.arc(piece.x, piece.y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

// Given a MouseEvent and an HTMLCanvasElement, determine at what
// coordinates the MouseEvent occurred on the canvas,
// rather than at the absolute point on the screen
export const getMouseCanvasPoint = (e: MouseEvent, canvas: HTMLCanvasElement): Point => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

export const gamePieceById = (id: number, gamePieces: Array<GamePiece>): GamePiece | undefined => {
  return gamePieces.find(p => p.id === id);
}

export const distanceBetweenPoints = (point1: Point, point2: Point) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

// Get the GamePiece at a particular point on the canvas
export const pieceAtCanvasPoint = (
  canvasPoint: Point,
  drawnPieces: Array<DrawnPiece>,
  gamePieces: Array<GamePiece>,
): GamePiece | undefined => {
  const drawnPiece = drawnPieces.find(drawnPiece => {
    const piecePos = { x: drawnPiece.x, y: drawnPiece.y };
    return distanceBetweenPoints(canvasPoint, piecePos) < drawnPiece.radius;
  });
  return drawnPiece ? gamePieceById(drawnPiece.gamePieceId, gamePieces) : undefined;
}

export const drawMissileRangeCircle = (
  ctx: CanvasRenderingContext2D,
  orders: Record<string, Array<GamePieceOrder>>,
  selectedPiece: GamePiece
) => {
  if (!selectedPiece) return;
  const unit = selectedPiece.playerUnit.unit;
  if (!unit.rangedRange) return;
  
  const selectedPieceOrders = orders[selectedPiece.id] || [];
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

export const drawMeleeRangeCircle = (
  ctx: CanvasRenderingContext2D,
  orders: Record<string, Array<GamePieceOrder>>,
  selectedPiece: GamePiece
) => {
  if (!selectedPiece) return;
  const unit = selectedPiece.playerUnit.unit;
  
  const selectedPieceOrders = orders[selectedPiece.id] || [];
  let selectedPieceMovingTo: Point | undefined = undefined;
  if (selectedPieceOrders.length > 0) {
    selectedPieceMovingTo = selectedPieceOrders[0].move?.action.moveTo;
  }

  const meleeRangeCircleCenter = selectedPieceMovingTo || selectedPiece.coordinates;
  
  ctx.beginPath();
  const radius = MELEE_ATTACK_RANGE;
  ctx.lineWidth = 1;
  ctx.strokeStyle = MELEE_RANGE_CIRCLE_STROKE_COLOR;
  ctx.fillStyle = MELEE_RANGE_CIRCLE_FILL_COLOR;
  ctx.arc(meleeRangeCircleCenter.x, meleeRangeCircleCenter.y, radius, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  fromCanvasPoint: Point,
  toCanvasPoint: Point,
  arrowColor: string,
) => {
  const xCenter = toCanvasPoint.x;
  const yCenter = toCanvasPoint.y;
  const dx = toCanvasPoint.x - fromCanvasPoint.x;
  const dy = toCanvasPoint.y - fromCanvasPoint.y;
  const r = 6;
  let x: number;
  let y: number;
  let angle: number;
  
  ctx.beginPath();
  ctx.strokeStyle = arrowColor;
  ctx.fillStyle = arrowColor;

  ctx.lineWidth = 4;
  ctx.moveTo(fromCanvasPoint.x, fromCanvasPoint.y);
  ctx.lineTo(toCanvasPoint.x, toCanvasPoint.y);
  ctx.stroke();
  ctx.closePath();
  
  ctx.beginPath();
  ctx.lineWidth = 1;
  angle = Math.atan2(dy, dx)
  x = r*Math.cos(angle) + xCenter;
  y = r*Math.sin(angle) + yCenter;
  ctx.moveTo(x, y);
  
  angle += (1/3)*(2*Math.PI)
  x = r*Math.cos(angle) + xCenter;
  y = r*Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);
  
  angle += (1/3)*(2*Math.PI)
  x = r*Math.cos(angle) + xCenter;
  y = r*Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);

  angle += (1/3)*(2*Math.PI)
  x = r*Math.cos(angle) + xCenter;
  y = r*Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);

  ctx.fill();
  ctx.closePath();
}

// Draw an arrow, but stop the arrow `offset` distance before the
// destination point. Useful for drawing arrows just touching the
// edge of a GamePiece, given the position and radius of the GamePiece.
export const drawArrowWithOffset = (
  ctx: CanvasRenderingContext2D,
  fromCanvasPoint: Point,
  toCanvasPoint: Point,
  arrowColor: string,
  offset: number,
) => {
  const slope = slopeBetweenPoints(fromCanvasPoint, toCanvasPoint);
  const angle = angleRadiansBetweenLineSlopes(slope, 0);
  const dx = Math.cos(angle) * offset;
  const dy = Math.sin(angle) * offset;
  const x = fromCanvasPoint.x < toCanvasPoint.x ? toCanvasPoint.x - dx : toCanvasPoint.x + dx;
  const y = fromCanvasPoint.y < toCanvasPoint.y ? toCanvasPoint.y - dy : toCanvasPoint.y + dy;
  drawArrow(ctx, fromCanvasPoint, { x, y }, arrowColor);
}

export const angleRadiansBetweenLineSlopes = (m1: number, m2: number): number => {
  return Math.atan(Math.abs((m1 - m2) / (1 + m1 * m2)));
}

export const slopeBetweenPoints = (p1: Point, p2: Point): number => {
  return ((p2.y - p1.y) * -1) / (p2.x - p1.x);
}

export const playerColor = (
  playerPublicKeys: Array<string>,
  minaPublicKey: string,
  colors: Array<string>,
): string => {
  const playerIndex = playerPublicKeys.findIndex((key) => key === minaPublicKey) || 0;
  return colors[playerIndex];
}

export const estimatedRangedAttackDamage = (
  selectedUnit: Unit,
  targetUnit: Unit,
): number => {
  if (
    !selectedUnit.rangedNumAttacks ||
    !selectedUnit.rangedHitRoll ||
    !selectedUnit.rangedWoundRoll ||
    !selectedUnit.rangedDamage
  ) {
    return 0;
  }

  const chanceToHit = (7 - selectedUnit.rangedHitRoll) / 6;
  const chanceToWound = (7 - selectedUnit.rangedWoundRoll) / 6;
  const armorPiercing = selectedUnit.rangedArmorPiercing || 0;
  const modifiedSave = targetUnit.armorSaveRoll + armorPiercing;
  const chanceToFailSave = 1 - (Math.max(7 - modifiedSave, 0) / 6);
  const estimatedDamage = selectedUnit.rangedNumAttacks * chanceToHit * chanceToWound * chanceToFailSave * selectedUnit.rangedDamage;
  return roundToPrecision(estimatedDamage, 1);
}

export const estimatedMeleeAttackDamage = (
  selectedUnit: Unit,
  targetUnit: Unit,
): number => {
  if (
    !selectedUnit.meleeNumAttacks ||
    !selectedUnit.meleeHitRoll ||
    !selectedUnit.meleeWoundRoll ||
    !selectedUnit.meleeDamage
  ) {
    return 0;
  }

  const chanceToHit = (7 - selectedUnit.meleeHitRoll) / 6;
  const chanceToWound = (7 - selectedUnit.meleeWoundRoll) / 6;
  const armorPiercing = selectedUnit.meleeArmorPiercing || 0;
  const modifiedSave = targetUnit.armorSaveRoll + armorPiercing;
  const chanceToFailSave = 1 - (Math.max(7 - modifiedSave, 0) / 6);
  const estimatedDamage = selectedUnit.meleeNumAttacks * chanceToHit * chanceToWound * chanceToFailSave * selectedUnit.meleeDamage;
  return roundToPrecision(estimatedDamage, 1);
}

export const roundToPrecision = (num: number, precision: number): number => {
  let coefficient = 1;
  for (let i = 0; i < precision; i++) {
    coefficient *= 10;
  }
  return Math.round((num + Number.EPSILON) * coefficient) / coefficient;
}
