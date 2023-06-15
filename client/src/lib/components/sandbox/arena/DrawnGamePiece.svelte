<script lang="ts">
  import { Layer } from 'svelte-canvas';
  import type { Render } from 'svelte-canvas';

  export let piece: GamePiece;
  export let playerColor: string;

  const PIECE_RADIUS = 12;
  let x = piece.coordinates.x;
  let y = piece.coordinates.y;
  let r = PIECE_RADIUS;
  let stroke = 'darkgray';
  let strokeWidth = 1;

  let render: Render;
  $: render = ({ context, width, height }) => {
    context.fillStyle = playerColor;
    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle = stroke;
    context.lineWidth = strokeWidth;
    context.beginPath();
    context.arc(x, y, r + strokeWidth / 2, 0, 2 * Math.PI);
    context.stroke();
  };
</script>

<Layer {render} />
