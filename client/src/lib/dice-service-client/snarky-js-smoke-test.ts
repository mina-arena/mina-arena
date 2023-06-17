import { PrivateKey } from 'snarkyjs';

export const smoke = PrivateKey.random().toBase58();