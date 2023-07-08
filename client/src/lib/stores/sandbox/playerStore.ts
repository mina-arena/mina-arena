import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { isReady, PrivateKey } from 'snarkyjs';

export const player1Default = {
  publicKey: 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL',
  privateKey: ''
}

console.log(window.localStorage)
console.log(window.localStorage.getItem('player1'))

let player1InitialValue = player1Default;
if (browser) {
  const stringValue = window.localStorage.getItem('player1');
  if (stringValue) {
    try {
      player1InitialValue = JSON.parse(stringValue);
    } catch (e) {
      window.localStorage.removeItem('player1');
      window.localStorage.removeItem('theme');
    }
  }
}

export const generateKeypair = async () => {
  await isReady;
  const privateKey = PrivateKey.random();
  const publicKey = privateKey.toPublicKey();

  return {
    publicKey: publicKey.toBase58(),
    privateKey: privateKey.toBase58(),
  }
}

export const setFromPrivateKey = async (privateKey: string) => {
  await isReady;
  const publicKey = PrivateKey.fromBase58(privateKey).toPublicKey().toBase58();
  player1.set({
    publicKey,
    privateKey,
  });
}

export const player1 = writable<Keypair>(player1InitialValue);
player1.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('player1', JSON.stringify(value));
  }
});
export const dummyPlayer1 = 'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL';
export const dummyPlayer2 = 'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s';
