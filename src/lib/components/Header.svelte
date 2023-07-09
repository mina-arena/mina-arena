<script lang="ts">
	import NavItem from './utils/NavItem.svelte';

	export let openUserModal: () => void;
</script>

<header>
	<nav
		class="flex border border-gray-200 border-solid px-4 lg:px-6 py-2.5 bg-light justify-between"
	>
		<div class="flex flex-wrap items-center">
			<div class="rounded overflow-hidden h-32 w-32">
				<img src="/images/logo.png" alt="logo" />
			</div>
			<NavItem href="/how-to-play">How To Play</NavItem>
			<NavItem href="/barracks">Barracks</NavItem>
			<NavItem href="/">Play</NavItem>
		</div>
		<div class="mr-10 cursor-pointer" on:click={openUserModal} on:keydown={openUserModal}>
			<NavItem><i class="_nav_item fa-solid fa-user" /></NavItem>
		</div>
	</nav>
</header>
