import { writable } from 'svelte/store';

const initError = '';
export const errorString = writable(initError);
