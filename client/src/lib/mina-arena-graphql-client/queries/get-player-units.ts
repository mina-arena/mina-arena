import { gql } from "@apollo/client/core/index.js"

export const GetPlayerUnitsQuery = gql`
  query GetPlayerUnits {
    playerUnits {
      id
      name
      player {
        id
        name
        minaPublicKey
      }
      unit {
        id
        name
      }
    }
  }
`;
