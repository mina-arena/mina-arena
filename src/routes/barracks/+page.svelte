<script>
	import DraftNewUnits from '$lib/components/sandbox/squad-selection/DraftNewUnits.svelte';
	import MyUnits from '$lib/components/sandbox/squad-selection/MyUnits.svelte';
	import { player1 } from '$lib/stores/sandbox/playerStore';

	const player = $player1.publicKey;
</script>

<div>
	<h2>Your Units:</h2>
	<MyUnits {player} />
</div>
<div>
	<h2>Available to Draft:</h2>
	<DraftNewUnits {player} />
</div>
