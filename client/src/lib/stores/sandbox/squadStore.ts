import { writable } from 'svelte/store';

const initSquads: Record<number, Array<Unit>> = {};

export const squads = writable(initSquads);