import { writable } from 'svelte/store';

const initUnits = new Array<Unit>;
export const units = writable(initUnits);