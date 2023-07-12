import { writable } from 'svelte/store';

const initSquads: Record<string, Squad> = {};

export const squads = writable(initSquads);