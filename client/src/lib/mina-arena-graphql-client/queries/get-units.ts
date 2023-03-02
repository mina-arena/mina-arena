import { gql } from "@apollo/client/core/index.js"

export const GetUnitsQuery = gql`
  query GetUnits {
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
