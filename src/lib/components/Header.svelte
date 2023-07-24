<script lang="ts">
	import NavItem from './utils/NavItem.svelte';

	export let openUserModal: () => void;
</script>

<header>
	<nav
		class="flex bg-stone-800 px-4 py-2.5 justify-between items-center"
	>
		<div class="flex flex-wrap justify-center content-center w-full">
			<NavItem href="/">Home</NavItem>
			<NavItem href="/how-to-play">Guide</NavItem>
			<a href="/" class="h-32 w-32 -mb-16"><img src="/images/king-logo.png" alt="logo" /></a>
			<NavItem href="/barracks">Barracks</NavItem>
			<NavItem href="/enter">Play</NavItem>
		</div>
		<div class="absolute right-0 mr-10 cursor-pointer" on:click={openUserModal} on:keydown={openUserModal}>
			<NavItem><i class="_nav_item fa-solid fa-user text-stone-400" /></NavItem>
		</div>
	</nav>
</header>
