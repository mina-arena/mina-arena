<script>
	import DraftNewUnits from '$lib/components/sandbox/squad-selection/DraftNewUnits.svelte';
	import MyUnits from '$lib/components/sandbox/squad-selection/MyUnits.svelte';
	import { player1 } from '$lib/stores/sandbox/playerStore';

	const player = $player1.publicKey;
</script>

<div class="p-12 sm:px-16 xl:px-24 xl:pb-24">
	<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase">Your units</h1>
	<div class="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-16">
		<MyUnits {player} />
	</div>
</div>
