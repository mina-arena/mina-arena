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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    ctx.fill();
    ctx.stroke();
  }
};

export type PieceRenderMode = 'normal' | 'hovered' | 'selected';

export const drawPiece = (ctx: CanvasRenderingContext2D, piece: DrawnPiece, pieceRenderMode: PieceRenderMode) => {
  ctx.beginPath();
  const radius = ['hovered', 'selected'].includes(pieceRenderMode) ? piece.radius + 2 : piece.radius;
  ctx.lineWidth = pieceRenderMode === 'selected' ? 2 : 1;
  ctx.strokeStyle = 'charcoal';
  ctx.arc(piece.x, piece.y, radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = piece.fill;
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