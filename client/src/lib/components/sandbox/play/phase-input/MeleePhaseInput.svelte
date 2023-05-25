<script lang="ts">
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';

	export let game: Game;
	export let currentPlayer: string;
	export let rerender: () => {};

	const minaArenaClient = new MinaArenaClient();

	const livingPlayerPieces = game.gamePieces.filter((p) => {
		return p.gamePlayer.player.minaPublicKey === currentPlayer &&
           p.health > 0;
	});

  const livingEnemyPieces = game.gamePieces.filter((p) => {
		return p.gamePlayer.player.minaPublicKey !== currentPlayer &&
           p.health > 0;
	});

  let meleeAttacks: Record<string, MeleeAttackAction> = {};

  const updateMeleeAttackTarget = (e: Event, p: GamePiece) => {
    const target = e.target as HTMLInputElement;
    const targetGamePieceId = target.valueAsNumber;

    if (meleeAttacks[p.id]) {
      // Overwriting a queued attack
      if (targetGamePieceId) {
        // With a new target
        meleeAttacks[p.id].action.targetGamePieceId = targetGamePieceId;
      } else {
        // With no target
        delete meleeAttacks[p.id];
      }
    } else {
      // Creating queued attack
      meleeAttacks[p.id] = {
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
  }

	const submitPhase = async () => {
		await minaArenaClient.submitMeleePhase(
			currentPlayer,
			game.id,
			game.currentPhase!.id,
			Object.values(meleeAttacks)
		);
		await rerender();
	};

	const calculateDistance = (p: GamePiece) => {
    const meleeAttack = meleeAttacks[p.id];
		if (meleeAttack) {
      const targetGamePieceId = meleeAttack.action.targetGamePieceId;
      const targetPiece = livingEnemyPieces.find(enemyPiece => enemyPiece.id.toString() === targetGamePieceId.toString());

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
		{#each livingPlayerPieces as piece}
			<tr>
				<td>{piece.playerUnit.name || 'Bob'} ({piece.playerUnit.unit.name}, ID: {piece.id})</td>
				<td>{piece.coordinates.x}, {piece.coordinates.y}</td>
        <td>5</td>
        <td>{piece.playerUnit.unit.meleeHitRoll}+</td>
        <td>{piece.playerUnit.unit.meleeWoundRoll}+</td>
        <td>{piece.playerUnit.unit.meleeArmorPiercing}</td>
        <td>{piece.playerUnit.unit.meleeDamage}</td>
				<td>
          ID: <input class="_input w-16" type="number" on:change={(e) => updateMeleeAttackTarget(e, piece)} />
				</td>
				<td>{#key meleeAttacks}{calculateDistance(piece)}{/key}</td>
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
    {#each livingEnemyPieces as piece}
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
