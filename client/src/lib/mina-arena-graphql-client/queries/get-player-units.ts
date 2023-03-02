import { gql } from "@apollo/client/core/index.js"

export const GetPlayerUnitsQuery = gql`
  query GetPlayerUnits {
    units {
      id
      name
      attackPower
      armor
      maxHealth
      movementSpeed
    }
  }
`;
