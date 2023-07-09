import { writable } from 'svelte/store';

const initPlayerUnits: Record<string, Array<PlayerUnit>> = {};
export const playerUnits = writable(initPlayerUnits);