<script lang="ts">
	export let game: Game;
	export let currentPlayer: string;

	const playerPieces = game.gamePieces?.filter((p) => {
		return p.gamePlayer.player.minaPublicKey === currentPlayer;
	});

	const moves: Record<string, { x: number; y: number }> = {};

	const updateMoveX = (e: Event, p: GamePiece) => {
		// Todo: replace this with piece id
		const target = e.target as HTMLInputElement;
		const key = `${p.coordinates.x}-${p.coordinates.y}`;
		if (moves[key]) {
			moves[key].x = target.valueAsNumber || p.coordinates.x;
		} else {
			moves[key] = {
				x: Number(target.valueAsNumber) || p.coordinates.x,
				y: p.coordinates.y
			};
		}
		console.log(moves);
	};

	const updateMoveY = (e: Event, p: GamePiece) => {
		// Todo: replace this with piece id
		const target = e.target as HTMLInputElement;
		const key = `${p.coordinates.x}-${p.coordinates.y}`;
		if (moves[key]) {
			moves[key].y = Number(target.valueAsNumber) || p.coordinates.y;
		} else {
			moves[key] = {
				x: p.coordinates.x,
				y: Number(target.valueAsNumber) || p.coordinates.y
			};
		}
		console.log(moves);
	};
</script>

<div>
	<p>Movement Phase Input</p>
	<table>
		<tr>
			<th>Piece</th>
			<th>Current Location</th>
			<th>Movement Stat</th>
			<th>Move To Input</th>
			<th>Distance</th>
		</tr>
		{#each playerPieces || [] as piece}
			<tr>
				<td>{piece.playerUnit.name || 'Bob'} the {piece.playerUnit.unit.name}</td>
				<td>{piece.coordinates.x}, {piece.coordinates.y}</td>
				<td>{piece.playerUnit.unit.movementSpeed}</td>
				<td>
					x: <input type="number" on:change={(e) => updateMoveX(e, piece)} />
					y: <input type="number" on:change={(e) => updateMoveY(e, piece)} />
				</td>
				<td>??</td>
			</tr>
		{/each}
	</table>
</div>
