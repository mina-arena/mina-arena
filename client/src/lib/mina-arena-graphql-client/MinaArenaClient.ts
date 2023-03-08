import { ApolloClient, HttpLink } from '@apollo/client/core/index.js';
import { InMemoryCache } from '@apollo/client/cache/index.js';
import { GetGameQuery } from './queries/get-game';
import { GetUnitsQuery } from './queries/get-units';
import { GetPlayerUnitsQuery } from './queries/get-player-units';
import { CreateGameMut } from './queries/mut-create-game';
import { StartGameMut } from './queries/mut-start-game';
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

  async getGame(gameId: number): Promise<Game> {
    const { data } = await this.client.query({
      query: GetGameQuery,
      variables: { gameId }
    });

    return data.game;
  }

  async getUnits(): Promise<Unit[]> {
    const { data } = await this.client.query({
      query: GetUnitsQuery,
    });

    console.log(`response: ${data}`)
    return data.units;
  }

  async getPlayerUnits(player: string): Promise<PlayerUnit[]> {
    const { data } = await this.client.query({
      query: GetPlayerUnitsQuery,
      variables: {
        player
      }
    });

    return data.player.playerUnits;
  }

  async createGame(players: Array<string>): Promise<Game> {
    const { data } = await this.client.mutate({
      mutation: CreateGameMut,
      variables: {
        input: {
          players: players.map((p, i) => {
            return { minaPublicKey: p, name: '', playerNumber: i }
          }),
          arenaHeight: 550,
          arenaWidth: 650
        }
      }
    });

    return data.createGame;
  }

  async startGame(gameId: number): Promise<Game> {
    const { data } = await this.client.mutate({
      mutation: StartGameMut,
      variables: {
        input: {
          gameId
        }
      }
    });

    return data.startGame;
  }

  async createGamePieces(player: string, squad: Squad, gameId: number): Promise<number[]> {
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
          unitId: Number(draftee.unit.id),
          name: draftee.name
        }
      })
    })
    console.log({
      variables: {
        minaPublicKey: player,
        gameId: gameId,
        gamePieces: gamePieceInputs
      }
    })
    const { data } = await this.client.mutate({
      mutation: CreateGamePiecesMut,
      variables: {
        input: {
          minaPublicKey: player,
          gameId: gameId,
          gamePieces: gamePieceInputs
        }
      }
    });

    return data.createGamePieces;
  }
}
