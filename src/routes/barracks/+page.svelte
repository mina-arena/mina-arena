<script lang="ts">
	import MyUnits from '$lib/components/sandbox/squad-selection/MyUnits.svelte';
	import MyPastGames from '$lib/components/sandbox/management/MyPastGames.svelte';
	import { player1 } from '$lib/stores/sandbox/playerStore';

	const player = $player1.publicKey;

	type PageSelected = 'MY_UNITS' | 'MY_PAST_GAMES';

	let pageSelected: PageSelected = 'MY_UNITS';
</script>

<div class="flex-grow flex flex-col pt-12 bg-stone-700 bg-arena-landscape-blurred bg-cover bg-fixed text-center text-white">
	<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase text-standoff-shadow">Barracks</h1>

	<!-- Tabs -->
	<div class="flex px-12 font-almendra-bold text-debossed uppercase">
	<div
			on:click={() => {
				pageSelected = 'MY_UNITS';
			}}
			on:keydown={() => {
				pageSelected = 'MY_UNITS';
			}}
			class={pageSelected === 'MY_UNITS'
				? 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer bg-white/25 drop-shadow-md border-t-[1px] border-white/40'
				: 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer'}
		>
			My Units
		</div>
		<div
			on:click={() => {
				pageSelected = 'MY_PAST_GAMES';
			}}
			on:keydown={() => {
				pageSelected = 'MY_PAST_GAMES';
			}}
			class={pageSelected === 'MY_PAST_GAMES'
				? 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer bg-white/25 drop-shadow-md border-t-[1px] border-white/40'
				: 'rounded-t-xl px-10 py-5 mr-5 cursor-pointer'}
		>
			Past Games
		</div>
	</div>

	{#if pageSelected === 'MY_UNITS'}
		<div class="flex-grow p-12 sm:px-16 xl:px-24 xl:pb-24 bg-white/25 backdrop-blur">
			<h1 class="font-almendra-bold text-3xl my-12 text-center uppercase">Your units</h1>
			<MyUnits {player} />
		</div>
	{:else if pageSelected === 'MY_PAST_GAMES'}
		<div class="flex-grow p-12 sm:px-16 xl:px-24 xl:pb-24 bg-white/25 backdrop-blur">
			<MyPastGames {player} />
		</div>
	{/if}
</div>
