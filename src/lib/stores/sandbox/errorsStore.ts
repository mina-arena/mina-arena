import { writable } from 'svelte/store';

const initError = '';
export const error = writable(initError);
