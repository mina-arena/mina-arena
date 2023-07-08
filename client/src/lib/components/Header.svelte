<script lang="ts">
	import NavItem from './utils/NavItem.svelte';

	export let openUserModal: () => void;
</script>

<header>
	<nav class="flex border-gray-200 px-4 lg:px-6 py-2.5 bg-light">
		<div class="flex flex-wrap items-center ml-10 w-full">
			<NavItem href="/how-to-play">How To Play</NavItem>
			<NavItem href="/barracks">Barracks</NavItem>
			<NavItem href="/play">Play</NavItem>
		</div>
		<div class="mr-10 cursor-pointer" on:click={openUserModal} on:keydown={openUserModal}>
			<NavItem><i class="_nav_item fa-solid fa-user" /></NavItem>
		</div>
	</nav>
</header>
