import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const player1Default = {
  publicKey: '',
  privateKey: ''
}

const player2Default = {
  publicKey: '',
  privateKey: ''
}

let player1InitialValue = player1Default;
let player2InitialValue = player2Default;

if (browser) {
  const player1FromBrowser = window.localStorage.getItem('player1');
  const player2FromBrowser = window.localStorage.getItem('player2');
  if (player1FromBrowser)
    try {
      player1InitialValue = JSON.parse(player1FromBrowser);
    } catch (e) {
      window.localStorage.removeItem('player1');
    }
  if (player2FromBrowser)
    try {
      player2InitialValue = JSON.parse(player2FromBrowser);
    } catch (e) {
      window.localStorage.removeItem('player2');
    }
}

export const player1 = writable<Keypair>(player1InitialValue);
export const player2 = writable<Keypair>(player2InitialValue);
player1.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('player1', JSON.stringify(value));
  }
});
player2.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('player2', JSON.stringify(value));
  }
});

export const generateKeypair = async () => {
  // Importing snarky like this makes it so only this function gets slowed down, not every page load
  const { PrivateKey } = await import('snarkyjs');
  const privateKey = PrivateKey.random();
  const publicKey = privateKey.toPublicKey();

  return {
    publicKey: publicKey.toBase58(),
    privateKey: privateKey.toBase58()
  };
};
