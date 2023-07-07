// The pub key that Mina Arena server will use to decrypt the message
// e.g. the address to which to encrypt the message
const SERVER_PUBLIC_KEY = 'B62qpge4uMq4Vv5Rvc8Gw9qSquUYd6xoW1pz7HQkMSHm6h1o7pvLPAN'

export class DiceRollServiceClient {
  baseUrl

  constructor() {
    this.baseUrl = import.meta.env.VITE_DICE_ROLL_SERVICE_URL;
  }

  async getDiceRolls(): Promise<DiceRollInput> {
    // Gets a single instance of a 3D6 roll
    const response = await fetch(
      `${this.baseUrl}/dice/${SERVER_PUBLIC_KEY}?` + new URLSearchParams({
        'n': '3',
        'sides': '6',
      }).toString()
    );

    return await response.json();
  }
}
