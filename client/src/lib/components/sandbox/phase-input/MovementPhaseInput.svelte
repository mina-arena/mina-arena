<script lang="ts">
	export let game: Game;
</script>

<div>
	<p>Movement Phase Input</p>
	<table>
		<tr>
			<th>Piece</th>
			<th>From</th>
			<th>To</th>
		</tr>
		{#each game.gamePieces || [] as piece}
			<tr>
				<td>{piece.playerUnit.name || 'Bob'} the {piece.playerUnit.unit.name}</td>
				<td>{piece.coordinates.x}, {piece.coordinates.y}</td>
				<td>??</td>
			</tr>
		{/each}
	</table>
</div>
