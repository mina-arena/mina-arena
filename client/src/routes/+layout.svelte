<script>
	import { Modals, closeModal } from 'svelte-modals';
	import '../app.css';
</script>

<Modals>
	<div slot="backdrop" class="backdrop" on:click={closeModal} on:keypress={closeModal} />
</Modals>

<slot class="container" />
