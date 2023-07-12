import { ApolloClient, HttpLink } from '@apollo/client/core/index.js';
import { InMemoryCache } from '@apollo/client/cache/index.js';
import { GetGameQuery } from './queries/get-game';
import { GetGameStatusQuery } from './queries/get-game-status';
import { GetUnitsQuery } from './queries/get-units';
import { GetPlayerUnitsQuery } from './queries/get-player-units';
import { CreateGameMut } from './queries/mut-create-game';
import { StartGameMut } from './queries/mut-start-game';
import { CreateGamePiecesMut } from './queries/mut-create-game-pieces';
import { CreateGamePieceActionsMut } from './queries/mut-create-action';
import { SubmitGamePhaseMut } from './queries/mut-submit-phase';
import { Action, Position } from 'mina-arena-contracts';

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

  async getGameStatus(gameId: number): Promise<Game> {
    const { data } = await this.client.query({
      query: GetGameStatusQuery,
      variables: { gameId }
    });

    return data.game;
  }

  async getGame(gameId: number): Promise<Game> {
    const { data } = await this.client.query({
      query: GetGameQuery,
      variables: { gameId },
      fetchPolicy: 'no-cache'
    });

    return data.game;
  }

  async getUnits(): Promise<Unit[]> {
    const { data } = await this.client.query({
      query: GetUnitsQuery,
    });
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

  async submitMovePhase(player: string, gameId: number, phaseId: number, moves: Array<MoveAction>, playerPrivateKey: string): Promise<number> {
    const { Field, PrivateKey } = await import('snarkyjs');
    let i = 0;
    const actions = moves.map((move) => {
      i++;
      const snarkyAction = new Action({
        nonce: Field(i),
        actionType: Field(0),
        actionParams: Position.fromXY(move.action.moveTo.x, move.action.moveTo.y).hash(),
        piece: Field(move.action.gamePieceNumber)
      });
      const signingKey = PrivateKey.fromBase58(playerPrivateKey);
      const signature = snarkyAction.sign(signingKey);
      move.action.nonce = i;
      return {
        actionType: 'MOVE',
        gamePieceId: move.gamePieceId,
        moveInput: move.action,
        signature: signature.toJSON()
      }
    });
    const mutationInput = {
      minaPublicKey: player,
      gameId,
      actions
    };

    await this.client.mutate({
      mutation: CreateGamePieceActionsMut,
      variables: {
        input: mutationInput
      }
    });

    const { data } = await this.client.mutate({
      mutation: SubmitGamePhaseMut,
      variables: {
        input: {
          minaPublicKey: player,
          gamePhaseId: phaseId
        }
      }
    });

    return data.id;
  }

  async submitShootingPhase(
    player: string,
    gameId: number,
    phaseId: number,
    rangedAttacks: Array<RangedAttackAction>,
    playerPrivateKey: string
  ): Promise<number> {
    const { Field, PrivateKey } = await import('snarkyjs');
    let i = 0;
    const actions = [];
    for (let i = 0; i < rangedAttacks.length; i++) {
      const rangedAttackCopy = JSON.parse(JSON.stringify(rangedAttacks[i]));
      const j = i + 1;
      const snarkyAction = new Action({
        nonce: Field(j),
        actionType: Field(1),
        actionParams: Field(rangedAttackCopy.action.targetGamePieceHash),
        piece: Field(rangedAttackCopy.action.gamePieceNumber)
      });
      const signingKey = PrivateKey.fromBase58(playerPrivateKey);
      const signature = snarkyAction.sign(signingKey);
      rangedAttackCopy.action.nonce = j;
      actions.push({
        actionType: 'RANGED_ATTACK',
        gamePieceId: rangedAttackCopy.gamePieceId,
        rangedAttackInput: rangedAttackCopy.action,
        signature: signature.toJSON()
      });
    };
    console.log(actions);
    const mutationInput = {
      minaPublicKey: player,
      gameId,
      actions
    };

    await this.client.mutate({
      mutation: CreateGamePieceActionsMut,
      variables: {
        input: mutationInput
      }
    });

    const { data } = await this.client.mutate({
      mutation: SubmitGamePhaseMut,
      variables: {
        input: {
          minaPublicKey: player,
          gamePhaseId: phaseId
        }
      }
    });

    return data.id;
  }

  async submitMeleePhase(
    player: string,
    gameId: number,
    phaseId: number,
    meleeAttacks: Array<MeleeAttackAction>,
    playerPrivateKey: string
  ): Promise<number> {
    const { Field, PrivateKey } = await import('snarkyjs');
    const actions = [];
    for (let i = 0; i < meleeAttacks.length; i++) {
      const meleeAttackCopy = JSON.parse(JSON.stringify(meleeAttacks[i]));
      const j = i + 1;
      const snarkyAction = new Action({
        nonce: Field(j),
        actionType: Field(2),
        actionParams: Field(meleeAttackCopy.action.targetGamePieceHash),
        piece: Field(meleeAttackCopy.action.gamePieceNumber)
      });
      const signingKey = PrivateKey.fromBase58(playerPrivateKey);
      const signature = snarkyAction.sign(signingKey);
      meleeAttackCopy.action.nonce = j;
      actions.push({
        actionType: 'MELEE_ATTACK',
        gamePieceId: meleeAttackCopy.gamePieceId,
        meleeAttackInput: meleeAttackCopy.action,
        signature: signature.toJSON(),
      });
    };
    const mutationInput = {
      minaPublicKey: player,
      gameId,
      actions
    };

    await this.client.mutate({
      mutation: CreateGamePieceActionsMut,
      variables: {
        input: mutationInput
      }
    });

    const { data } = await this.client.mutate({
      mutation: SubmitGamePhaseMut,
      variables: {
        input: {
          minaPublicKey: player,
          gamePhaseId: phaseId
        }
      }
    });

    return data.id;
  }
}
