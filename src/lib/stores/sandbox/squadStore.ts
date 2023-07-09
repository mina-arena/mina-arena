import { writable } from 'svelte/store';

const initSquads: Record<string, Squad> = {
  'B62qinnN8N4wXLR9K1Ji2HbeTG2k3nVBDD3AHyYP38wUDzPkq4YctHL': {
    units: [],
    playerUnits: []
  },
  'B62qpq9xPZGJvv2CwhRBsYGb9yHPaar6HWSJ8rC3s54mX7f8X9wX15s': {
    units: [],
    playerUnits: []
  }
};

export const squads = writable(initSquads);