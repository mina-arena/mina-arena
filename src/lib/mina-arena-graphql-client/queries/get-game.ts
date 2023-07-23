import { gql } from "@apollo/client/core/index.js"
import { UnitFullFragment, GamePhaseFullFragment } from "../fragments";

export const GetGameQuery = gql`
  ${UnitFullFragment}
  ${GamePhaseFullFragment}
  query GetGame($gameId: Int!) {
    game(id: $gameId) {
      id
      status
      turnNumber
      previousPhase {
        ...GamePhaseFull
      }
      currentPhase {
        ...GamePhaseFull
      }
      gamePlayers {
        player {
          minaPublicKey
        }
      }
      winningGamePlayer {
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
        gamePieceNumber
        hash
        health
      }
      arena {
        width
        height
      }
    }
  }
`;
