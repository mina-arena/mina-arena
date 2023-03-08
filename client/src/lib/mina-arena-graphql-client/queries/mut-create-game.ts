import { gql } from "@apollo/client/core/index.js"

export const CreateGameMut = gql`
  mutation CreateGame($input: CreateGameInput!) {
    createGame(input: $input) {
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
