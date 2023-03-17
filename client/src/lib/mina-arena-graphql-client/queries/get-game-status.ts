import { gql } from "@apollo/client/core/index.js"

export const GetGameStatusQuery = gql`
  query GetGame($gameId: ID!) {
    game(id: $gameId) {
      id
      status
    }
  }
`
