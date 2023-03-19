<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';

	export let game: Game;
	export let currentPlayer: string;

	const minaArenaClient = new MinaArenaClient();

	const playerPieces = game.gamePieces?.filter((p) => {
		return p.gamePlayer.player.minaPublicKey === currentPlayer;
	});

	const moves: Record<string, MoveAction> = {};

	const updateMoveX = (e: Event, p: GamePiece) => {
		const target = e.target as HTMLInputElement;
		if (moves[p.id]) {
			moves[p.id].action.moveTo.x = target.valueAsNumber || p.coordinates.x;
		} else {
			moves[p.id] = {
				gamePieceId: p.id,
				action: {
					moveFrom: {
						x: p.coordinates.x,
						y: p.coordinates.y
					},
					moveTo: {
						x: target.valueAsNumber,
						y: p.coordinates.y
					}
				}
			};
		}
	};

	const updateMoveY = (e: Event, p: GamePiece) => {
		const target = e.target as HTMLInputElement;
		if (moves[p.id]) {
			moves[p.id].action.moveTo.y = target.valueAsNumber || p.coordinates.y;
		} else {
			moves[p.id] = {
				gamePieceId: p.id,
				action: {
					moveFrom: {
						x: p.coordinates.x,
						y: p.coordinates.y
					},
					moveTo: {
						x: p.coordinates.x,
						y: target.valueAsNumber
					}
				}
			};
		}
	};

	const submitPhase = () => {
		console.log(moves);
		minaArenaClient.submitMovePhase(
			currentPlayer,
			game.id,
			game.currentPhase!.id,
			Object.values(moves)
		);
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
	<button on:click={submitPhase}>Submit</button>
</div>
