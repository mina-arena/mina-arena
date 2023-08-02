<script lang="ts">
	import { goto } from '$app/navigation';
	import { MinaArenaClient } from '$lib/mina-arena-graphql-client/MinaArenaClient';
	import { errorString } from '$lib/stores/sandbox/errorsStore';
	import { player1, player2, generateKeypair } from '$lib/stores/sandbox/playerStore';

	let isLoggedIn = !($player1.publicKey === '') && !($player2.publicKey === '');

	const createGame = async () => {
		try {
			const minaArenaClient = new MinaArenaClient();
			const game = await minaArenaClient.createGame([$player1.publicKey, $player2.publicKey]);
			console.log(game.id);
			goto(`/sandbox/games/${game.id}`);
		} catch (err) {
			$errorString = String(err);
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

<div
	class="flex-grow p-16 lg:p-24 xl:px-[30vw] mx-auto text-center text-stone-300 bg-stone-400 bg-chainmail bg-cover"
>
	<h1 class="font-almendra-bold text-4xl uppercase">Sandbox mode</h1>
	{#key $player1.publicKey}
		{#if !isLoggedIn}
			<p class="break-break-word" style="word-break: break-word">
				Looks like you are not yet logged in!
			</p>
			<p class="break-break-word" style="word-break: break-word">
				Mina Arena will create a public-private keypair for you and store it in your browser. We
				won't track the keys on our backend, so if you clear your browser storage, you will not be
				able to create actions in your existing games. Don't worry, you can always generate yourself
				a new keypair by clicking the user icon in the top right corner.
			</p>
			<p class="break-break-word" style="word-break: break-word">
				In sandbox mode, we will generate a second keypair to play as your opponent in the game. You
				will control both sides' pieces, but they are two separate keypairs stored in your browser.
			</p>
			<button
					class="bg-stone-700 hover:bg-stone-600 text-stone-300 w-auto rounded py-2 px-4"
				on:click={generateNewKeypair}>Generate me a new Keypair!</button
			>
			<div class="mx-auto">OR</div>
			<div class="mx-auto flex items-center rounded p-2 hover:bg-stone-600 [&>*]:mx-2">
				<div>
					<label>Input a Mina private key:</label>
					<input class="_input p-2 text-black rounded-md" type="text" bind:value={newPrivateKey} />
				</div>
				<div>
					<button
						class="rounded p-2 border border-solid border-neutral hover:bg-stone-500"
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
				class="font-almendra-bold uppercase text-center py-4 px-5 m-2 rounded-lg home-button"
				on:click={createGame}>Create Game</button
			>
		{/if}
	{/key}
</div>
