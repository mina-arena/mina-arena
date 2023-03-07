<script lang="ts">
	import { onMount } from 'svelte';
	import { squads } from '$lib/stores/sandbox/squadStore';

	type DrawnPiece = {
		x: number;
		y: number;
		width: number;
		height: number;
		fill: string;
	};

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let pieces: Array<DrawnPiece> = [];

	let offsetTop: number;
	let offsetLeft: number;
	let mouseIsDown = false;
	let lastX = 0;
	let lastY = 0;

	const player1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
	const player2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';

	onMount(() => {
		canvas = document.getElementById('canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;

		offsetTop = canvas.offsetTop;
		offsetLeft = canvas.offsetLeft;

		let i = 10;
		$squads[player1].playerUnits.forEach((unit) => {
			makePiece(i, 30, 50, 25, 'skyblue');
			i += 85;
		});

		i = 10;
		$squads[player2].playerUnits.forEach((unit) => {
			makePiece(i, 500, 50, 25, 'pink');
			i += 85;
		});
		drawAllPieces();
	});

	const makePiece = (x: number, y: number, width: number, height: number, fill: string) => {
		const piece = {
			x: x,
			y: y,
			width: width,
			height: height,
			right: x + width,
			bottom: y + height,
			fill: fill
		};
		pieces.push(piece);
		return piece;
	};

	const drawAllPieces = () => {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < pieces.length; i++) {
			let piece = pieces[i];
			drawPiece(piece);
			ctx.fillStyle = piece.fill;
			ctx.fill();
			ctx.stroke();
		}
	};

	const drawPiece = (piece: DrawnPiece) => {
		ctx.beginPath();
		ctx.moveTo(piece.x, piece.y);
		ctx.lineTo(piece.x + piece.width, piece.y);
		ctx.lineTo(piece.x + piece.width + 10, piece.y + piece.height / 2);
		ctx.lineTo(piece.x + piece.width, piece.y + piece.height);
		ctx.lineTo(piece.x, piece.y + piece.height);
		ctx.closePath();
	};

	const onMouseDown = (e: MouseEvent) => {
		const mouseX = e.clientX - offsetLeft;
		const mouseY = e.clientY - offsetTop;

		// mousedown stuff here
		lastX = mouseX;
		lastY = mouseY;
		mouseIsDown = true;
	};

	const onMouseUp = (e: MouseEvent) => {
		mouseIsDown = false;
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!mouseIsDown) {
			return;
		}

		const mouseX = e.clientX - offsetLeft;
		const mouseY = e.clientY - offsetTop;

		// mousemove stuff here
		for (let i = 0; i < pieces.length; i++) {
			const piece = pieces[i];
			drawPiece(piece);
			if (ctx.isPointInPath(lastX, lastY)) {
				piece.x += mouseX - lastX;
				piece.y += mouseY - lastY;
			}
		}
		lastX = mouseX;
		lastY = mouseY;
		drawAllPieces();
	};
</script>

<canvas
	id="canvas"
	width="650"
	height="550"
	class="border border-slate-400 mx-auto"
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	on:mousemove={onMouseMove}
/>
