const PIECE_STROKE_COLOR = '#101010';
const PIECE_SELECTED_STROKE_COLOR = '#771111';
const MOVEMENT_ARROW_STROKE_COLOR = 'black';
const MOVEMENT_ARROW_FILL_COLOR = 'black';

export const makePiece = (gamePieceId: number, x: number, y: number, radius: number, fill: string) => {
  const piece = {
    gamePieceId: gamePieceId,
    x: x,
    y: y,
    radius: radius,
    fill: fill
  };
  return piece;
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

export const drawArrow = (
  ctx: CanvasRenderingContext2D,
  fromCanvasPoint: Point,
  toCanvasPoint: Point
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
  ctx.strokeStyle = MOVEMENT_ARROW_STROKE_COLOR;
  ctx.fillStyle = MOVEMENT_ARROW_FILL_COLOR;

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
