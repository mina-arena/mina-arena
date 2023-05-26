import { gql } from "@apollo/client/core/index.js"
import { UnitFullFragment } from "../fragments";

export const GetGameQuery = gql`
  ${UnitFullFragment}
  query GetGame($gameId: ID!) {
    game(id: $gameId) {
      id
      status
      turnNumber
      currentPhase {
        id
        name
        gamePlayer {
          player {
            minaPublicKey
          }
        }
        gamePieceActions {
          id
          gamePiece {
            id
          }
          actionType
        }
      }
      gamePlayers {
        player {
          minaPublicKey
        }
      }
      gamePieces {
        id
        gamePlayer {
          player {
            minaPublicKey
          }
        }
        playerUnit {
          id
          name
          unit {
            ...UnitFull
          }
        }
        coordinates {
          x
          y
        }
        health
      }
      arena {
        width
        height
      }
    }
  }
`;
