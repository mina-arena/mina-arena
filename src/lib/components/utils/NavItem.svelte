<script lang="ts">
	export let href: string | null = null;
</script>

{#if href}
	<a class="self-center text-lg font-semibold whitespace-nowrap text-stone-400 py-2 px-4 bg-stone-800 hover:bg-stone-900 ease-in-out transition-all duration-200 rounded" {href}><slot /></a>
{:else}
	<slot class="self-center text-lg font-semibold whitespace-nowrap text-stone-400 py-2 px-4 bg-stone-800 hover:bg-stone-900 ease-in-out transition-all duration-200 rounded" />
{/if}
