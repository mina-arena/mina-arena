import { ApolloClient, HttpLink } from '@apollo/client/core/index.js';
import { InMemoryCache } from '@apollo/client/cache/index.js';
import { GetUnitsQuery } from './queries/get-units';
import { GetPlayerUnitsQuery } from './queries/get-player-units';
import { CreateGamePiecesMut } from './queries/mut-create-game-pieces';

export class MinaArenaClient {
  client

  constructor() {
    this.client = this.setupClient();
  }

  setupClient() {
    const link = new HttpLink({
      uri: `${import.meta.env.VITE_BACKEND_SERVER_URL}/graphql/`
    });


    const client = new ApolloClient({
      link,
      cache: new InMemoryCache()
    });
    return client;
  }

  async getUnits(): Promise<Unit[]> {
    console.log("Getting Units...")
    const { data } = await this.client.query({
      query: GetUnitsQuery,
    });

    console.log(`response: ${data}`)
    return data.units;
  }

  async getPlayerUnits(): Promise<PlayerUnit[]> {
    const { data } = await this.client.query({
      query: GetPlayerUnitsQuery,
    });

    return data.playerUnits;
  }

  async createGamePieces(player: string, squad: Squad): Promise<number[]> {
    const { units, playerUnits } = squad;
    const gamePieceInputs: Array<CreateGamePieceInput> = [];
    playerUnits.forEach(playerUnit => {
      gamePieceInputs.push({
        playerUnitId: playerUnit.id
      })
    });
    units.forEach(draftee => {
      gamePieceInputs.push({
        createPlayerUnit: {
          unitId: draftee.unit.id,
          name: draftee.name
        }
      })
    })
    console.log({
      variables: {
        minaPublicKey: player,
        gameId: 1,
        gamePieces: gamePieceInputs
      }
    })
    const { data } = await this.client.mutate({
      mutation: CreateGamePiecesMut,
      variables: {
        input: {
          minaPublicKey: player,
          gameId: 1,
          gamePieces: gamePieceInputs
        }
      }
    });

    return data.createGamePieces;
  }
}
