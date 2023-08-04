<script lang="ts">
	import { closeModal } from 'svelte-modals';

	// provided by Modals
	export let isOpen: boolean;
</script>

{#if isOpen}
	<div class="modal"><i class="fa fa-solid fa-refresh fa-spin" /></div>
{/if}
