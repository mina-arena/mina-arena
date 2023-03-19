import { gql } from "@apollo/client/core/index.js"

export const GetGameQuery = gql`
  query GetGame($gameId: ID!) {
    game(id: $gameId) {
      id
      status
      turnNumber
      currentPhase {
        id
        name
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
          unit {
            name
            attackPower
            armor
            maxHealth
            movementSpeed
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
