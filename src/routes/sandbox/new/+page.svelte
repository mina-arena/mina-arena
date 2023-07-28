<script lang="ts">
	import { goto } from '$app/navigation';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { error } from '$lib/stores/sandbox/errorsStore';
	import { player1, player2, generateKeypair } from '$lib/stores/sandbox/playerStore';

	let isLoggedIn = !($player1.publicKey === '') && !($player2.publicKey === '');

	const createGame = async () => {
		try {
			const minaArenaClient = new MinaArenaClient();
			const game = await minaArenaClient.createGame([$player1.publicKey, $player2.publicKey]);
			console.log(game.id);
			goto(`/sandbox/games/${game.id}`);
		} catch (err) {
			$error = String(err);
		}
	};

	const validatePrivateKey = (key: string) => {
		const validRegex = /^EKE[A-HJ-NP-Za-km-z1-9]{49}$/;
		return validRegex.test(key);
	};

	const generateNewKeypair = async () => {
		const p1Keys = await generateKeypair();
		const p2Keys = await generateKeypair();
		player1.set(p1Keys);
		player2.set(p2Keys);
		isLoggedIn = true;
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
		const p2Keys = await generateKeypair();
		player1.set({
			publicKey,
			privateKey: newPrivateKey
		});
		player2.set(p2Keys);
		newPrivateKey = '';
		isLoggedIn = true;
	};

	let newPrivateKey = '';
</script>

<div class="p-16 lg:p-24 xl:max-w-[60vw] mx-auto text-center">
	<h1 class="font-almendra-bold text-4xl uppercase">Sandbox mode</h1>
	{#key $player1.publicKey}
		{#if !isLoggedIn}
			<p>Looks like you are not yet logged in!</p>
			<p>
				Mina Arena will create a public-private keypair for you and store it in your browser. We
				won't track the keys on our backend, so if you clear your browser storage, you will not be
				able to create actions in your existing games. Don't worry, you can always generate yourself
				a new keypair by clicking the user icon in the top right corner.
			</p>
			<p>
				In sandbox mode, we will generate a second keypair to play as your opponent in the game. You
				will control both sides' pieces, but they are two separate keypairs stored in your browser.
			</p>
			<p />
			<div>
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
		{:else}
			<p class="break-break-word" style="word-break: break-word">
				Currently logged in as {$player1.publicKey}. If you would like to use a different keypair
				for this game, then you can generate a new one by clicking the user icon in the top right.
			</p>
			<button
				class="mx-auto m-2 p-2 rounded-lg border border-slate-800 bg-gray-200 hover:bg-gray-400"
				on:click={createGame}>Create Game</button
			>
		{/if}
	{/key}
</div>
