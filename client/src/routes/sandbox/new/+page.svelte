<script lang="ts">
	let playerTurn = 1;
	let currentSquad: Set<number> = new Set();
	const eligibleUnits = [...Array(25).keys()];

	const squads: Record<number, Set<number>> = {};

	const selectSquad = () => {
		squads[playerTurn] = currentSquad;
		currentSquad = new Set();
		playerTurn++;
	};
</script>

<div class="text-center">
	<h2 class="text-2xl font-semibold mb-10">Sandbox Mode</h2>
	<div>
		<h3 class="text-xl">Select your squad</h3>
		<p>Drafting for Player{playerTurn}</p>
		<div class="grid grid-cols-5 gap-6 w-3/4 mx-auto">
			{#each eligibleUnits as unit}
				<div class="border border-slate-300 rounded py-6 col-span-1">{unit}</div>
			{/each}
		</div>
		<button on:click={selectSquad}>Select Squad</button>
	</div>
</div>
