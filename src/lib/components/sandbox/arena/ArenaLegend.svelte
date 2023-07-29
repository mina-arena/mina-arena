<script lang="ts">
	import { truncateMinaPublicKey } from '$lib/utils';

	export let playerPublicKeys: Array<string>;
	export let playerColors: Array<string>;
	export let currentPlayer: string;
</script>

<div>
	<div class="flex items-center my-6">
		{#if currentPlayer === playerPublicKeys[0]}
			<div class="active-player w-6">&rarr;</div>
		{:else}
			<div class="w-6" />
		{/if}
		<div class="mx-4 flex-none w-6 h-6 rounded-full bg-primary border border-zinc-600" />
		Player 1: {truncateMinaPublicKey(playerPublicKeys[0])}
	</div>
	<div class="flex items-center my-6">
		{#if currentPlayer === playerPublicKeys[1]}
			<div class="active-player w-6">&rarr;</div>
		{:else}
			<div class="w-6" />
		{/if}
		<div class="mx-4 flex-none w-6 h-6 rounded-full bg-secondary border border-zinc-600" />
		Player 2: {truncateMinaPublicKey(playerPublicKeys[1])}
	</div>
</div>
