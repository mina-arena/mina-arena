<script>
	import { Modals, closeModal, openModal } from 'svelte-modals';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import UserModal from '$lib/components/modals/UserModal.svelte';
	import { errorString } from '$lib/stores/sandbox/errorsStore';

	const openUserModal = () => {
		openModal(UserModal, {});
	};

	const dismissError = () => {
		$errorString = '';
	};
</script>

<Modals>
	<div slot="backdrop" class="backdrop bg-dark/75" on:click={closeModal} on:keypress={closeModal} />
</Modals>

<main class="min-h-screen flex flex-col">
	<Header {openUserModal} />
	<div class="w-full min-h-full flex flex-col flex-grow">
		{#if $errorString}
			<div class="w-full p-4 bg-red-800 text-sm text-center text-white drop-shadow-lg flex">
				<div class="mx-auto">
					{$errorString}
				</div>
				<div class="mr-8">
					<button on:click={dismissError} on:keydown={dismissError}
						><i class="fa-solid fa-x" /></button
					>
				</div>
			</div>
		{/if}
		<slot />
	</div>
</main>
