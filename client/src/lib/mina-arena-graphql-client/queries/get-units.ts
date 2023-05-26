import { gql } from "@apollo/client/core/index.js"
import { UnitFullFragment } from "../fragments";

export const GetUnitsQuery = gql`
  ${UnitFullFragment}
  query GetUnits {
    units {
      ...UnitFull
    }
  }
`;
