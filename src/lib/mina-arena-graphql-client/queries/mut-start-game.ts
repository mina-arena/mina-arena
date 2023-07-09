import { gql } from "@apollo/client/core/index.js"

export const StartGameMut = gql`
  mutation StartGame($input: StartGameInput!) {
    startGame(input: $input) {
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
