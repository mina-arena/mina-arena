<script lang="ts">
	import { truncateMinaPublicKey } from '$lib/utils';

	import { onMount } from 'svelte';
	import { playerColor } from '../play/utils';

	export let game: Game;
	export let playerPublicKeys: Array<string>;
	export let playerColors: Array<string>;

	const textColorByPlayerColor: Record<string, string> = {
		pink: '#FF3030',
		lightblue: '#5050FF'
	};

	const colorByPlayerKey: Record<string, string> = playerPublicKeys.reduce((acc, key) => {
		const rawColor = playerColor(playerPublicKeys, key, playerColors);
		acc[key] = textColorByPlayerColor[rawColor] || rawColor;
		return acc;
	}, {} as Record<string, string>);

	onMount(() => {
		const log = document.getElementById('action-log') as HTMLDivElement;
		const gameOver = ['COMPLETED', 'CANCELED'].includes(game.status || '');
		const loggedPhase = gameOver ? game.currentPhase : game.previousPhase;
		if (!log || !loggedPhase) return;

		let actionLogText = '';
		let snarkyActionLogText = '';
		actionLogText += `Previous Phase: ${loggedPhase.name}<br/><br/>`;

		let initialPhaseState = '';
		let finalPhaseState = '';
		if (loggedPhase.initialPhaseState) {
			const json = JSON.parse(loggedPhase.initialPhaseState);
			Object.keys(json).forEach((k) => {
				initialPhaseState += `${k}=>${json[k]}<br/>`;
			});
		}
		if (loggedPhase.finalPhaseState) {
			const json = JSON.parse(loggedPhase.finalPhaseState);
			Object.keys(json).forEach((k) => {
				finalPhaseState += `${k}=>${json[k]}<br/>`;
			});
		}
		snarkyActionLogText += `SnarkyJS Transition From:<br/>${initialPhaseState}<br/><br/>`;
		snarkyActionLogText += `SnarkyJS Transition To:<br/> ${finalPhaseState}<br/><br/>`;

		if (loggedPhase.gamePieceActions.length > 0) {
			const actionsByPieceId = phaseActionsByPieceId(loggedPhase.gamePieceActions);

			// Iterate over actions for each piece
			Object.keys(actionsByPieceId).forEach((pieceId: string) => {
				const groupedActions = groupedPieceActions(actionsByPieceId[pieceId]);
				groupedActions.pieceActionsWithoutTarget.forEach((action) => {
					switch (action.actionType) {
						case 'MOVE':
							actionLogText += movementActionLogText(action);
							break;
					}
				});
				Object.keys(groupedActions.pieceActionsByTargetIdByType).forEach((actionType: string) => {
					const pieceActionsByTargetId = groupedActions.pieceActionsByTargetIdByType[actionType];
					Object.keys(pieceActionsByTargetId).forEach((targetPieceId: string) => {
						const pieceActionsAtTarget = pieceActionsByTargetId[targetPieceId];

						let additionalLog, additionalSnarkyLog;
						switch (actionType) {
							case 'RANGED_ATTACK':
								[additionalLog, additionalSnarkyLog] =
									rangedAttackActionLogText(pieceActionsAtTarget);
								actionLogText += additionalLog;
								snarkyActionLogText += additionalSnarkyLog;
								break;
							case 'MELEE_ATTACK':
								[additionalLog, additionalSnarkyLog] =
									meleeAttackActionLogText(pieceActionsAtTarget);
								actionLogText += additionalLog;
								snarkyActionLogText += additionalSnarkyLog;
								break;
						}
					});
				});
			});
		} else {
			actionLogText += 'No actions were made.';
		}

		actionLogText += '<br/><br/>';
		actionLogText += snarkyActionLogText;

		log.innerHTML += actionLogText;
	});

	const phaseActionsByPieceId = (actions: GamePieceAction[]): Record<string, GamePieceAction[]> => {
		let actionsByPieceId: Record<string, GamePieceAction[]> = {};
		actions.forEach((action) => {
			const pieceId = action.gamePiece.id;
			if (!actionsByPieceId[pieceId]) actionsByPieceId[pieceId] = [];
			actionsByPieceId[pieceId].push(action);
		});
		return actionsByPieceId;
	};

	type GroupedPieceActions = {
		pieceActionsWithoutTarget: GamePieceAction[];
		pieceActionsByTargetIdByType: Record<string, Record<string, GamePieceAction[]>>;
	};

	// Given an array of GamePieceActions for a piece, group them
	// by action type and target, and return the grouped actions
	const groupedPieceActions = (pieceActions: GamePieceAction[]): GroupedPieceActions => {
		let pieceActionsWithoutTarget: GamePieceAction[] = [];
		let pieceActionsByTargetIdByType: Record<string, Record<string, GamePieceAction[]>> = {};
		pieceActions.forEach((action) => {
			switch (action.actionType) {
				case 'MOVE':
					pieceActionsWithoutTarget.push(action);
					break;
				case 'RANGED_ATTACK':
					const rangedTargetId = action.actionData.targetGamePiece?.id;
					if (!rangedTargetId) break;
					if (!pieceActionsByTargetIdByType[action.actionType])
						pieceActionsByTargetIdByType[action.actionType] = {};
					if (!pieceActionsByTargetIdByType[action.actionType][rangedTargetId])
						pieceActionsByTargetIdByType[action.actionType][rangedTargetId] = [];
					pieceActionsByTargetIdByType[action.actionType][rangedTargetId].push(action);
					break;
				case 'MELEE_ATTACK':
					const meleeTargetId = action.actionData.targetGamePiece?.id;
					if (!meleeTargetId) break;
					if (!pieceActionsByTargetIdByType[action.actionType])
						pieceActionsByTargetIdByType[action.actionType] = {};
					if (!pieceActionsByTargetIdByType[action.actionType][meleeTargetId])
						pieceActionsByTargetIdByType[action.actionType][meleeTargetId] = [];
					pieceActionsByTargetIdByType[action.actionType][meleeTargetId].push(action);
					break;
			}
		});
		return { pieceActionsWithoutTarget, pieceActionsByTargetIdByType };
	};

	const movementActionLogText = (action: GamePieceAction): string => {
		let text = '';
		const playerKey = action.gamePiece.gamePlayer.player.minaPublicKey;
		const color = colorByPlayerKey[playerKey];
		const playerUnit = action.gamePiece.playerUnit;
		text += `<span style="color: ${color};">${playerUnit.name} (${playerUnit.unit.name})</span> moves`;
		return `${text}<br/>`;
	};

	const rangedAttackActionLogText = (actions: GamePieceAction[]): string[] => {
		let text = '';
		let snarkyActionLogText = '';
		const attacks: ResolvedAttack[] = [];
		actions.forEach((a) => {
			let diceRolls = '';
			if (a.actionData.rollInput) {
				const json = JSON.parse(a.actionData.rollInput);
				Object.keys(json).forEach((k) => {
					diceRolls += `${k}=>${JSON.stringify(json[k])}<br/>`;
				});
			}
			snarkyActionLogText += `Encrypted Dice Roll Input:<br/>${diceRolls}<br/><br/>`;

			// Ignore skipped attacks (due to target already being dead)
			if (a.actionData.resolvedAttack) attacks.push(a.actionData.resolvedAttack);
		});
		const attackingPiece = actions[0].gamePiece;
		const targetPiece = actions[0].actionData.targetGamePiece;
		if (!attackingPiece || !targetPiece || !attacks) return ['', ''];

		const attackingPlayerUnit = attackingPiece.playerUnit;
		const targetPlayerUnit = targetPiece.playerUnit;
		const attackingPlayerKey = attackingPiece.gamePlayer.player.minaPublicKey;
		const targetPlayerKey = targetPiece.gamePlayer.player.minaPublicKey;
		const attackingPlayerColor = colorByPlayerKey[attackingPlayerKey] || 'black';
		const targetPlayerColor = targetPlayerKey
			? colorByPlayerKey[targetPlayerKey] || 'black'
			: 'black';

		const attackingPieceTitle = `<span style="color: ${attackingPlayerColor}">${attackingPlayerUnit.name} (${attackingPlayerUnit.unit.name})</span>`;
		const targetPieceTitle = `<span style="color: ${targetPlayerColor}">${targetPlayerUnit.name} (${targetPlayerUnit.unit.name})</span>`;

		text += `${attackingPieceTitle} shoots x${attacks.length} at ${targetPieceTitle}<br/>`;

		if (attacks.length === 0) {
			text += `${targetPieceTitle} is already destroyed, skipping attack.`
			return [`${text}<br/><br/>`];
		}

		let hitRollsPassed: number[] = [];
		let hitRollsFailed: number[] = [];
		let woundRollsPassed: number[] = [];
		let woundRollsFailed: number[] = [];
		let saveRollsPassed: number[] = [];
		let saveRollsFailed: number[] = [];

		attacks.forEach((attack) => {
			if (attack.hitRoll.success) {
				hitRollsPassed.push(attack.hitRoll.roll);
				
				if (attack.woundRoll.success) {
					woundRollsPassed.push(attack.woundRoll.roll);

					if (attack.saveRoll.success) {
						saveRollsPassed.push(attack.saveRoll.roll);
					} else {
						saveRollsFailed.push(attack.saveRoll.roll);
					}
				} else {
					woundRollsFailed.push(attack.woundRoll.roll);
				}
			} else {
				hitRollsFailed.push(attack.hitRoll.roll);
			}
		});

		// TODO: If in the future one unit can make multiple attacks with different
		// weapons which have different stats, we will have to ungroup them here
		text += `${attacks[0].hitRoll.rollNeeded}+ to hit: `;
		text += `<span style="color: green;">${hitRollsPassed.join(' ')}</span> `;
		text += `<span style="color: red;">${hitRollsFailed.join(' ')}</span><br/>`;

		if (hitRollsPassed.length > 0) {
			text += `${attacks[0].woundRoll.rollNeeded}+ to wound: `;
			text += `<span style="color: green;">${woundRollsPassed.join(' ')}</span> `;
			text += `<span style="color: red;">${woundRollsFailed.join(' ')}</span><br/>`;

			if (woundRollsPassed.length > 0) {
				text += `${attacks[0].saveRoll.rollNeeded}+ to save: `;
				text += `<span style="color: green;">${saveRollsPassed.join(' ')}</span> `;
				text += `<span style="color: red;">${saveRollsFailed.join(' ')}</span><br/>`;
			}
		}

		let totalDmg = 0;
		actions.forEach((action) => (totalDmg += action.actionData.totalDamageDealt || 0));
		text += `Damage: ${totalDmg} (avg. ${actions[0].actionData.totalDamageAverage?.toFixed(1)})`;

		if (totalDmg && totalDmg > 0) {
			if (targetPiece.health > 0) {
				text += `<br/>${targetPieceTitle} is down to ${targetPiece.health}/${targetPlayerUnit.unit.maxHealth} HP`;
			} else {
				text += `<br/>${targetPieceTitle} was destroyed!`;
			}
		}

		return [`${text}<br/><br/>`, `${snarkyActionLogText}<br/><br/>`];
	};

	const meleeAttackActionLogText = (actions: GamePieceAction[]): string[] => {
		let text = '';
		let snarkyActionLogText = '';
		const attacks: ResolvedAttack[] = [];
		actions.forEach((a) => {
			let diceRolls = '';
			if (a.actionData.rollInput) {
				const json = JSON.parse(a.actionData.rollInput);
				Object.keys(json).forEach((k) => {
					diceRolls += `${k}=>${JSON.stringify(json[k])}<br/>`;
				});
			}
			snarkyActionLogText += `Encrypted Dice Roll Input:<br/>${diceRolls}<br/><br/>`;

			// Ignore skipped attacks (due to target already being dead)
			if (a.actionData.resolvedAttack) attacks.push(a.actionData.resolvedAttack);
		});
		const attackingPiece = actions[0].gamePiece;
		const targetPiece = actions[0].actionData.targetGamePiece;
		if (!attackingPiece || !targetPiece || !attacks) return ['', ''];

		const attackingPlayerUnit = attackingPiece.playerUnit;
		const targetPlayerUnit = targetPiece.playerUnit;
		const attackingPlayerKey = attackingPiece.gamePlayer.player.minaPublicKey;
		const targetPlayerKey = targetPiece.gamePlayer.player.minaPublicKey;
		const attackingPlayerColor = colorByPlayerKey[attackingPlayerKey] || 'black';
		const targetPlayerColor = targetPlayerKey
			? colorByPlayerKey[targetPlayerKey] || 'black'
			: 'black';

		const attackingPieceTitle = `<span style="color: ${attackingPlayerColor}">${attackingPlayerUnit.name} (${attackingPlayerUnit.unit.name})</span>`;
		const targetPieceTitle = `<span style="color: ${targetPlayerColor}">${targetPlayerUnit.name} (${targetPlayerUnit.unit.name})</span>`;

		text += `${attackingPieceTitle} strikes x${attacks.length} at ${targetPieceTitle}<br/>`;

		if (attacks.length === 0) {
			text += `${targetPieceTitle} is already destroyed, skipping attack.`
			return [`${text}<br/><br/>`];
		}

		let hitRollsPassed: number[] = [];
		let hitRollsFailed: number[] = [];
		let woundRollsPassed: number[] = [];
		let woundRollsFailed: number[] = [];
		let saveRollsPassed: number[] = [];
		let saveRollsFailed: number[] = [];

		attacks.forEach((attack) => {
			if (attack.hitRoll.success) {
				hitRollsPassed.push(attack.hitRoll.roll);

				if (attack.woundRoll.success) {
					woundRollsPassed.push(attack.woundRoll.roll);

					if (attack.saveRoll.success) {
						saveRollsPassed.push(attack.saveRoll.roll);
					} else {
						saveRollsFailed.push(attack.saveRoll.roll);
					}
				} else {
					woundRollsFailed.push(attack.woundRoll.roll);
				}
			} else {
				hitRollsFailed.push(attack.hitRoll.roll);
			}
		});

		// TODO: If in the future one unit can make multiple attacks with different
		// weapons which have different stats, we will have to ungroup them here
		text += `${attacks[0].hitRoll.rollNeeded}+ to hit: `;
		text += `<span style="color: green;">${hitRollsPassed.join(' ')}</span> `;
		text += `<span style="color: red;">${hitRollsFailed.join(' ')}</span><br/>`;

		if (hitRollsPassed.length > 0) {
			text += `${attacks[0].woundRoll.rollNeeded}+ to wound: `;
			text += `<span style="color: green;">${woundRollsPassed.join(' ')}</span> `;
			text += `<span style="color: red;">${woundRollsFailed.join(' ')}</span><br/>`;

			if (woundRollsPassed.length > 0) {
				text += `${attacks[0].saveRoll.rollNeeded}+ to save: `;
				text += `<span style="color: green;">${saveRollsPassed.join(' ')}</span> `;
				text += `<span style="color: red;">${saveRollsFailed.join(' ')}</span><br/>`;
			}
		}

		let totalDmg = 0;
		actions.forEach((action) => (totalDmg += action.actionData.totalDamageDealt || 0));
		text += `Damage: ${totalDmg} (avg. ${actions[0].actionData.totalDamageAverage?.toFixed(1)})`;

		if (totalDmg && totalDmg > 0) {
			if (targetPiece.health > 0) {
				text += `<br/>${targetPieceTitle} is down to ${targetPiece.health}/${targetPlayerUnit.unit.maxHealth} HP`;
			} else {
				text += `<br/>${targetPieceTitle} was destroyed!`;
			}
		}

		return [`${text}<br/><br/>`, `${snarkyActionLogText}<br/><br/>`];
	};
</script>

<div
	id="action-log"
	class="flex-grow w-full h-[30vh] min-h-[200px] bg-stone-400 rounded-xl border-b-[1px] border-b-stone-300 mx-auto p-2 overflow-y-auto"
	style="box-shadow: inset 0 4px 4px rgba(0,0,0,0.25); word-break: break-word"
/>
