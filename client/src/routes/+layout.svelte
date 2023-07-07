<script>
	import { Modals, closeModal } from 'svelte-modals';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
</script>

<Modals>
	<div slot="backdrop" class="backdrop" on:click={closeModal} on:keypress={closeModal} />
</Modals>

<Header />
<main class="container pt-10 bg-light">
	<slot />
</main>
