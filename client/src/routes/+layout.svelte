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
	<div slot="backdrop" class="backdrop" on:click={closeModal} on:keypress={closeModal} />
</Modals>

<Header {openUserModal} />
<main class="container pt-10 bg-light">
	<slot />
</main>
