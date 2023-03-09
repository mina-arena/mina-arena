import { gql } from "@apollo/client/core/index.js"

export const GetGameQuery = gql`
  query GetGame($gameId: ID!) {
    game(id: $gameId) {
      id
      status
      turnNumber
      gamePlayers {
        player {
          minaPublicKey
        }
      }
    }
  }
`;
