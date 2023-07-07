<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	export let data;

	export function load() {
		throw redirect(302, `/sandbox/games/${data.game.id}`);
	}
</script>
