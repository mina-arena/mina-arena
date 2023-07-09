import { gql } from "@apollo/client/core/index.js"

export const SubmitGamePhaseMut = gql`
  mutation SubmitGamePhase($input: SubmitGamePhaseInput!) {
    submitGamePhase(input: $input) {
      id
    }
  }
`;
