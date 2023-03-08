import { gql } from "@apollo/client/core/index.js"

export const GetPlayerUnitsQuery = gql`
  query GetPlayerUnits($player: String!) {
    player(minaPublicKey: $player) {
      id
      name
      playerUnits {
        id,
        name,
        unit {
          id
          name
          attackPower
          armor
          maxHealth
          movementSpeed
        }
      }
    }
  }
`;
