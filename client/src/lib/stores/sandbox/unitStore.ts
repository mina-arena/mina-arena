import { writable } from 'svelte/store';

export const dummyUnits = () => {
  return [...Array(25).keys()].map((n) => {
    return {
      cost: (n % 3) + 2,
      id: n,
      selected: false
    };
  })
}

export const units = writable(dummyUnits());