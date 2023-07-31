<script lang="ts">
	import { truncateMinaPublicKey } from '$lib/utils';

	export let playerPublicKeys: Array<string>;
	export let playerColors: Array<string>;
	export let currentPlayer: string;
</script>

<div class="w-full my-8">
	<div class="flag flex bg-[#BD2104] items-center my-6 py-6 text-white drop-shadow-lg">
		{#if currentPlayer === playerPublicKeys[0]}
			<div class="w-12 text-center text-2xl">&#10148;</div>
			Player 1: {truncateMinaPublicKey(playerPublicKeys[0])}
		{:else}
			<div class="w-12" />
			<span class="opacity-50">Player 1: {truncateMinaPublicKey(playerPublicKeys[0])}</span>
		{/if}
	</div>
	<div class="flag flex bg-[#003CB0] items-center my-6 py-6 text-white drop-shadow-lg">
		{#if currentPlayer === playerPublicKeys[1]}
			<div class="w-12 text-center text-2xl">&#10148;</div>
			Player 2: {truncateMinaPublicKey(playerPublicKeys[1])}
		{:else}
			<div class="w-12" />
			<span class="opacity-50">Player 2: {truncateMinaPublicKey(playerPublicKeys[1])}</span>
		{/if}
	</div>
</div>
