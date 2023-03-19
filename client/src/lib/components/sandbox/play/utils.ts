export const makePiece = (x: number, y: number, width: number, height: number, fill: string) => {
  const piece = {
    x: x,
    y: y,
    width: width,
    height: height,
    right: x + width,
    bottom: y + height,
    fill: fill
  };
  return piece;
};

export const drawAllPieces = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pieces: Array<DrawnPiece>) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    drawPiece(ctx, piece);
    ctx.fillStyle = piece.fill;
    ctx.fill();
    ctx.stroke();
  }
};

export const drawPiece = (ctx: CanvasRenderingContext2D, piece: DrawnPiece) => {
  ctx.beginPath();
  ctx.moveTo(piece.x, piece.y);
  ctx.lineTo(piece.x + piece.width, piece.y);
  ctx.lineTo(piece.x + piece.width, piece.y + piece.height);
  ctx.lineTo(piece.x, piece.y + piece.height);
  ctx.closePath();
};