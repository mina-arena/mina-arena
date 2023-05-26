export const makePiece = (x: number, y: number, radius: number, fill: string) => {
  const piece = {
    x: x,
    y: y,
    radius: radius,
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
  ctx.arc(piece.x, piece.y, piece.radius, 0, 2 * Math.PI, false);
};