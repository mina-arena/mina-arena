<script lang="ts">
	import { DiceRollServiceClient } from '$lib/dice-service-client/DiceRollServiceClient';
	import { onMount } from 'svelte';

	const diceRollServiceClient = new DiceRollServiceClient();

	onMount(async () => {
		console.log('getting dice rolls');
		const resp = await diceRollServiceClient.getDiceRolls(2, 6);
		console.log(JSON.stringify(resp));
	});
</script>

<div class="flex">
	<div class="mt-6 mb-10 h-fit text-center w-1/2 mx-auto">
		<h2 class="text-2xl font-semibold">Choose your path</h2>
	</div>
</div>
<div class="grid grid-cols-2 gap-20 w-3/4 border border-slate-100 mx-auto">
	<a href="/sandbox" class="text-center card _button">
		<h3 class="text-xl mb-3">Sandbox</h3>
		<p class="text-slate-600">
			In sandbox mode, you control both sides. It's a good way to learn the game or practice a
			strategy. Gameplay is fast and no proofs are generated.
		</p>
	</a>
	<div class="text-center card _button">
		<h3 class="text-xl mb-3 text-slate-400">Play with a Friend</h3>
		<p class="text-slate-400">(IN DEVELOPMENT)</p>
		<p class="text-slate-400">
			In multiplayer mode, you will only control your own pieces. Turns will take time to prove, but
			the result of the game will be proved and tracked on the Mina blockchain!
		</p>
	</div>
</div>
