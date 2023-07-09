import { gql } from "@apollo/client/core/index.js"

export const CreateGamePieceActionsMut = gql`
  mutation createGamePieceActions($input: CreateGamePieceActionsInput!) {
    createGamePieceActions(input: $input) {
      id
    }
  }
`;
