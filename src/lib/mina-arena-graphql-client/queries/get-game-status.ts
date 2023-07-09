import { gql } from "@apollo/client/core/index.js"

export const GetGameStatusQuery = gql`
  query GetGame($gameId: Int!) {
    game(id: $gameId) {
      id
      status
    }
  }
`
