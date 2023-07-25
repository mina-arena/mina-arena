<script>
	import DraftNewUnits from '$lib/components/sandbox/squad-selection/DraftNewUnits.svelte';
	import MyUnits from '$lib/components/sandbox/squad-selection/MyUnits.svelte';
	import { player1 } from '$lib/stores/sandbox/playerStore';

	const player = $player1.publicKey;
</script>

<div class="p-12">
	<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase">Your units</h1>
	<MyUnits {player} />

	<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase">Available to draft</h1>
	<DraftNewUnits {player} />
</div>
