import { writable } from 'svelte/store';

const initPlayerUnits = new Array<PlayerUnit>;
export const playerUnits = writable(initPlayerUnits);