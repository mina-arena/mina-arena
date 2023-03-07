import { gql } from "@apollo/client/core/index.js"

export const CreateGamePiecesMut = gql`
  mutation CreateGamePieces($input: CreateGamePiecesInput!) {
    createGamePieces(input: $input) {
      id
    }
  }
`;
