import { gql } from "@apollo/client/core/index.js"

export const GetPlayerGamesQuery = gql`
  query GetPlayerGames(
    $minaPublicKey: String!,
    $statuses: [GameStatus!]
  ) {
    gamesForPlayer(
      minaPublicKey: $minaPublicKey,
      statuses: $statuses
    ) {
      id
      status
      turnNumber
      currentPhase {
        turnNumber
        name
        gamePlayer {
          player {
            minaPublicKey
            name
          }
        }
      }
      gamePlayers {
        player {
          minaPublicKey
          name
        }
      }
    }
  }
`;
