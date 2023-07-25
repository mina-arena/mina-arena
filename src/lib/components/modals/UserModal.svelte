<script lang="ts">
	import { closeModal } from 'svelte-modals';
	import { player1 } from '$lib/stores/sandbox/playerStore';
	import { truncateMinaPublicKey } from '$lib/utils';

	// provided by Modals
	export let isOpen: boolean;

	const validatePrivateKey = (key: string) => {
		const validRegex = /^EKE[A-HJ-NP-Za-km-z1-9]{49}$/;
		return validRegex.test(key);
	};

	const generateKeypair = async () => {
		// Importing snarky like this makes it so only this function gets slowed down, not every page load
		const { PrivateKey } = await import('snarkyjs');
		const privateKey = PrivateKey.random();
		const publicKey = privateKey.toPublicKey();

		return {
			publicKey: publicKey.toBase58(),
			privateKey: privateKey.toBase58()
		};
	};

	const generateNewKeypair = async () => {
		const keys = await generateKeypair();
		player1.set(keys);
	};

	const setPrivateKey = async () => {
		const { PrivateKey } = await import('snarkyjs');
		const isValid = validatePrivateKey(newPrivateKey);
		if (!isValid) {
			alert('Invalid private key, try again');
			newPrivateKey = '';
			return;
		}
		const publicKey = PrivateKey.fromBase58(newPrivateKey).toPublicKey().toBase58();
		player1.set({
			publicKey,
			privateKey: newPrivateKey
		});
		newPrivateKey = '';
	};

	let newPrivateKey = '';
</script>

{#if isOpen}
	<div class="modal">
		<div class="w-[650px] max-h-screen overflow-y-scroll rounded-md p-4 bg-light flex flex-col pointer-events-auto">
			<div class="mx-auto [&>*]:p-4">
				<div><h2 class="text-center text-xl font-semibold">User Management</h2></div>
				<div>
					In Mina Arena, you sign your actions with a private key. The most secure way to do this is
					with an integration like Auro Wallet connected to a hardware signing device. Since this is
					a game with no financial risk, we will key pairs directly. Mina Arena uses browser storage
					to store your key from session to session, or if you like, you can store your own key and
					enter it here.
				</div>
				<div>
					Mina Arena will NOT store your private key on our server, but it is highly recommended to
					generate a new key with no Mina attached to play the game with.
				</div>
			</div>
			<div class="flex mx-auto rounded p-2 bg-primary-light [&>*]:mx-2">
				<div class="font-semibold">Current Keypair:</div>
				<div>{truncateMinaPublicKey($player1.publicKey)}</div>
				<div>{truncateMinaPublicKey($player1.privateKey)}</div>
			</div>
			<div class="mx-auto m-2">
				<button
					class="rounded p-2 border border-solid border-neutral hover:bg-secondary"
					on:click={generateNewKeypair}>Generate me a new Keypair!</button
				>
			</div>
			<div class="mx-auto">OR</div>
			<div class="mx-auto flex rounded p-2 hover:bg-secondary [&>*]:mx-2">
				<div>
					<label>Input a Mina private key:</label>
					<input class="_input" type="text" bind:value={newPrivateKey} />
				</div>
				<div>
					<button
						class="rounded p-2 border border-solid border-neutral hover:bg-secondary"
						on:click={setPrivateKey}>Set Private Key</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
