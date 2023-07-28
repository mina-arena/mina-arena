<script lang="ts">
	import DraftNewUnits from '$lib/components/sandbox/squad-selection/DraftNewUnits.svelte';
	import MyUnits from '$lib/components/sandbox/squad-selection/MyUnits.svelte';
	import MyPastGames from '$lib/components/sandbox/management/MyPastGames.svelte';
	import { player1 } from '$lib/stores/sandbox/playerStore';

	const player = $player1.publicKey;

	type PageSelected = 'MY_UNITS' | 'MY_PAST_GAMES';

	let pageSelected: PageSelected = 'MY_UNITS';
</script>

<h1 class="font-almendra-bold text-4xl my-12 text-center uppercase">Barracks</h1>
<div class="flex mx-auto">
	<div
			on:click={() => {
						pageSelected = 'MY_UNITS';
					}}
			class={pageSelected === 'MY_UNITS'
						? 'border border-slate-600 rounded px-10 py-5 mr-5 cursor-pointer bg-slate-100'
						: 'border border-slate-300 rounded px-10 py-5 mr-5 cursor-pointer'}
	>
		My Units
	</div>
	<div
			on:click={() => {
						pageSelected = 'MY_PAST_GAMES';
					}}
			class={pageSelected === 'MY_PAST_GAMES'
						? 'border border-slate-600 rounded px-10 py-5 cursor-pointer bg-slate-100'
						: 'border border-slate-300 rounded px-10 py-5 cursor-pointer'}
	>
		Past Games
	</div>
</div>

{#if pageSelected === 'MY_UNITS'}
	<div class="p-12 sm:px-16 xl:px-24 xl:pb-24">
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-16">
			<MyUnits {player} />
		</div>
	</div>
{:else if pageSelected === 'MY_PAST_GAMES'}
	<MyPastGames {player} />
{/if}
