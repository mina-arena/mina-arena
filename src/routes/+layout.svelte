<script>
	import { Modals, closeModal, openModal } from 'svelte-modals';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import UserModal from '$lib/components/modals/UserModal.svelte';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	const openUserModal = () => {
		openModal(UserModal, {});
	};
</script>

<Modals>
	<div slot="backdrop" class="backdrop bg-dark/75" on:click={closeModal} on:keypress={closeModal} />
</Modals>

<main class="h-[100vh] flex flex-col">
	<Header {openUserModal} />
	<div class="w-full text-red-700">
		{#if $errorString}
			<div>{$errorString}</div>
		{/if}
	</div>
	<div class="w-full flex flex-col flex-grow">
		<slot />
	</div>
</main>
