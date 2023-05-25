<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';

	export let game: Game;
	export let currentPlayer: string;
	export let rerender: () => {};

	const minaArenaClient = new MinaArenaClient();

	const playerPieces = game.gamePieces.filter((p) => {
		return p.gamePlayer.player.minaPublicKey === currentPlayer;
	});

  const enemyPieces = game.gamePieces.filter((p) => {
		return p.gamePlayer.player.minaPublicKey !== currentPlayer;
	});

  let rangedAttacks: Record<string, RangedAttackAction> = {};

  const updateRangedAttackTarget = (e: Event, p: GamePiece) => {
    const target = e.target as HTMLInputElement;
    const targetGamePieceId = target.valueAsNumber;

    if (rangedAttacks[p.id]) {
      rangedAttacks[p.id].action.targetGamePieceId = targetGamePieceId;
    } else {
      rangedAttacks[p.id] = {
        gamePieceId: p.id,
        action: {
          targetGamePieceId: targetGamePieceId,
          diceRoll: {
            publicKey: { x: 'xValue', y: 'yValue' },
            cipherText: 'supersecret',
            signature: { r: 'rValue', s: 'sValue' },
          }
        }
      }
    }

    // ??
    // rangedAttacks = rangedAttacks;
  }

	const submitPhase = async () => {
		await minaArenaClient.submitShootingPhase(
			currentPlayer,
			game.id,
			game.currentPhase!.id,
			Object.values(rangedAttacks)
		);
		await rerender();
	};

	const calculateDistance = (p: GamePiece) => {
    const rangedAttack = rangedAttacks[p.id];
		if (rangedAttack) {
      const targetGamePieceId = rangedAttack.action.targetGamePieceId;
      const targetPiece = enemyPieces.find(enemyPiece => enemyPiece.id.toString() === targetGamePieceId.toString());

      if (targetPiece) {
        return Math.sqrt(
          (p.coordinates.x - targetPiece.coordinates.x) ** 2 +
            (p.coordinates.y - targetPiece.coordinates.y) ** 2
        ).toFixed(2);
      } else {
        return 'Not found!';
      }
		} else {
			return 0;
		}
	};
</script>

<br>
<div>
	<table>
		<tr>
			<th>Your Piece</th>
			<th>Current Location</th>
			<th>Max Range</th>
      <th>Hit</th>
      <th>Wound</th>
      <th>AP</th>
      <th>Damage</th>
			<th>Target Piece</th>
			<th>Distance</th>
		</tr>
		{#each playerPieces || [] as piece}
			<tr>
				<td>{piece.playerUnit.name || 'Bob'} ({piece.playerUnit.unit.name}, ID: {piece.id})</td>
				<td>{piece.coordinates.x}, {piece.coordinates.y}</td>
        {#if piece.playerUnit.unit.rangedNumAttacks }
          <td>{piece.playerUnit.unit.rangedRange}</td>
          <td>{piece.playerUnit.unit.rangedHitRoll}+</td>
          <td>{piece.playerUnit.unit.rangedWoundRoll}+</td>
          <td>{piece.playerUnit.unit.rangedArmorPiercing}</td>
          <td>{piece.playerUnit.unit.rangedDamage}</td>
        {:else}
          <td>No ranged attack</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        {/if}
				<td>
          ID: <input class="_input w-16" type="number" on:change={(e) => updateRangedAttackTarget(e, piece)} />
				</td>
				<td>{#key rangedAttacks}{calculateDistance(piece)}{/key}</td>
			</tr>
		{/each}
	</table>
  <br>
  <table>
    <tr>
			<th>Enemy Piece</th>
			<th>Current Location</th>
      <th>Armor Save</th>
      <th>Health</th>
		</tr>
    {#each enemyPieces || [] as piece}
			<tr>
				<td>{piece.playerUnit.name || 'Bob'} ({piece.playerUnit.unit.name}, ID: {piece.id})</td>
				<td>{piece.coordinates.x}, {piece.coordinates.y}</td>
				<td>{piece.playerUnit.unit.armorSaveRoll}+</td>
				<td>{piece.health}/{piece.playerUnit.unit.maxHealth}</td>
			</tr>
		{/each}
  </table>
	<button on:click={submitPhase}>Submit</button>
</div>
