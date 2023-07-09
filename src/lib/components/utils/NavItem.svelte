<script lang="ts">
	export let href: string | null = null;
</script>

{#if href}
	<span
		class="self-center text-xl font-semibold whitespace-nowrap text-dark py-2 px-4 hover:bg-warmGray-300 ease-in-out transition-all duration-200 rounded"
		><a {href}><slot /></a></span
	>
{:else}
	<span
		class="self-center text-xl font-semibold whitespace-nowrap text-dark py-2 px-4 hover:bg-warmGray-300 ease-in-out transition-all duration-200 rounded"
		><slot /></span
	>
{/if}
