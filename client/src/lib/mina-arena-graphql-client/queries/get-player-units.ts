import { gql } from "@apollo/client/core/index.js"
import { UnitFullFragment } from "../fragments";

export const GetPlayerUnitsQuery = gql`
  ${UnitFullFragment}
  query GetPlayerUnits($player: String!) {
    player(minaPublicKey: $player) {
      id
      name
      playerUnits {
        id
        name
        unit {
          ...UnitFull
        }
      }
    }
  }
`;
