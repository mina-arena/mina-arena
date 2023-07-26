<script>
	import { Modals, closeModal, openModal } from 'svelte-modals';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import UserModal from '$lib/components/modals/UserModal.svelte';

	const openUserModal = () => {
		openModal(UserModal, {});
	};
</script>

<Modals>
	<div
		slot="backdrop"
		class="backdrop bg-dark/75"
		on:click={closeModal}
		on:keypress={closeModal}
	/>
</Modals>

<main class="h-[100vh] flex flex-col">
	<Header {openUserModal} />
	<div class="w-full flex flex-col flex-grow">
		<slot />
	</div>
</main>
