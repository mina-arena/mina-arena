import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const player1Default = {
  publicKey: 'B62qmUvZ59kbvYuy9H8DmaziEPPuBrpJW2FTp3A8Vk7cSnVr7dAK1xC',
  privateKey: 'EKEfWEgoUiTUuKkHWQeeE3gAZtueLs5tFGuZAjtcXkL4mqj9UM2F'
}

const dummyPlayerDefault = {
  publicKey: 'B62qnzWe6wjK4FJLWpBvSDUXtejuf2fVJR8NHdP2VgFu4rrxwwCFM1r',
  privateKey: 'EKEe1DihaXv5edGhZY1g4a8P6ob18mUsfvwnKnotHmg71n93d4WB'
}

let player1InitialValue = player1Default;
if (browser) {
  const stringValue = window.localStorage.getItem('player1');
  if (stringValue) {
    try {
      player1InitialValue = JSON.parse(stringValue);
    } catch (e) {
      window.localStorage.removeItem('player1');
    }
  }
}

export const player1 = writable<Keypair>(player1InitialValue);
player1.subscribe((value) => {
  if (browser) {
    window.localStorage.setItem('player1', JSON.stringify(value));
  }
});
export const dummyPlayer = writable<Keypair>(dummyPlayerDefault);
