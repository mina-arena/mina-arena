import { writable } from 'svelte/store';

const initSquads: Record<number, Squad> = {};

export const squads = writable(initSquads);