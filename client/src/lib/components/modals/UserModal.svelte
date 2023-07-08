<script lang="ts">
	import { closeModal } from 'svelte-modals';

	// provided by Modals
	export let isOpen: boolean;
</script>

{#if isOpen}
	<div class="modal">
		<div
			class="w-[500px] h-[400px] rounded-md p-4 bg-white flex flex-col justify-center pointer-events-auto"
		>
			<div>Hello!</div>
		</div>
	</div>
{/if}
