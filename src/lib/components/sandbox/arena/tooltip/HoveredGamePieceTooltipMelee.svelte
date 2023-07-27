<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { onAfterUpdate } from './tooltip-helpers';
	import {
		distanceBetweenPoints,
		estimatedMeleeAttackDamage,
		MELEE_ATTACK_RANGE
	} from '../../play/utils';
	import HoveredGamePieceTooltipUnitCard from './HoveredGamePieceTooltipUnitCard.svelte';

	export let game: Game;
	export let hoveredPiece: GamePiece | undefined;
	export let selectedPiece: GamePiece | undefined;
	export let tooltipAbsolutePosition: Point | undefined;
	export let playerPublicKeys: Array<string>;
	export let playerColors: Array<string>;

	let currentPlayerMinaPubKey: string = game.currentPhase?.gamePlayer.player.minaPublicKey || '';

	afterUpdate(() => {
		onAfterUpdate(playerPublicKeys, playerColors, hoveredPiece, selectedPiece, tooltipAbsolutePosition);
	});
</script>

<div
	id="piece-hover-tooltip"
	class="hidden fixed max-w-[300px] overflow-hidden p-4 rounded-2xl bg-stone-900 text-stone-700 drop-shadow-lg"
>
	{#if hoveredPiece}
		{@const owner = hoveredPiece.gamePlayer.player.minaPublicKey}
		{@const hoveredUnit = hoveredPiece.playerUnit.unit}

		<HoveredGamePieceTooltipUnitCard {hoveredPiece} />

		{#if selectedPiece}
			<div class="border-t border-black">
				{#if owner === currentPlayerMinaPubKey}
					{#if selectedPiece.id === hoveredPiece.id}
						<div class="text-center">Selected unit</div>
					{:else}
						<div class="text-center">Friendly unit</div>
					{/if}
				{:else}
					{@const attackDistance = distanceBetweenPoints(
						selectedPiece.coordinates,
						hoveredPiece.coordinates
					)}
					{#if attackDistance > MELEE_ATTACK_RANGE}
						<div class="text-center">Target out of range</div>
					{:else}
						{@const selectedUnit = selectedPiece.playerUnit.unit}
						{@const estDamage = estimatedMeleeAttackDamage(selectedUnit, hoveredUnit)}
						{@const estHealthAfter = Math.max(hoveredPiece.health - estDamage, 0)}

						<div class="grid grid-cols-3 gap-4mx-auto">
							<div class="col-span-2 border-r border-black p-[8px]">
								<div class="text-center">
									{selectedPiece.playerUnit.name}
									<i class="fa-solid fa-sword" />
									{hoveredPiece.playerUnit.name}
								</div>

								<table class="mx-auto mt-[5px]">
									<tr class="[&>*]:px-[4px] [&>*]:text-center">
										<th />
										<th><i class="fa-solid fa-hashtag" /></th>
										<th><i class="fa-solid fa-bullseye-arrow" /></th>
										<th><i class="fa-solid fa-hand-fist" /></th>
										<th><i class="fa-solid fa-shield-slash" /></th>
										<th><i class="fa-solid fa-heart-crack" /></th>
									</tr>
									<tr class="[&>*]:px-[4px] [&>*]:text-center">
										<td><i class="fa-solid fa-sword" /></td>
										<td>{selectedUnit.meleeNumAttacks}</td>
										<td>{selectedUnit.meleeHitRoll}+</td>
										<td>{selectedUnit.meleeWoundRoll}+</td>
										<td>{selectedUnit.meleeArmorPiercing}</td>
										<td>{selectedUnit.meleeDamage}</td>
									</tr>
								</table>
							</div>
							<div class="col-span-1 p-[8px]">
								<div class="text-center mt-[5px]">
									<i class="fa-solid fa-calculator mr-[5px]" />
									<span class="text-xl">{estDamage}</span>
									<span class="text-sm"> dmg</span>
								</div>
								<div class="text-center mt-[2px]">
									<i class="fa-solid fa-heart-crack mr-[5px]" />
									<span class="text-lg">{hoveredPiece.health}</span>
									<i class="fa-solid fa-arrow-right fa-sm" />
									{#if estHealthAfter > 0}
										<span class="text-lg">{estHealthAfter}</span>
									{:else}
										<i class="fa-solid fa-skull" />
									{/if}
								</div>
								<div class="text-center mt-[10px]">Attack?</div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		{/if}
	{/if}
</div>
