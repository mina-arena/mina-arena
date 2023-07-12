import { gql } from "@apollo/client/core/index.js"
import { UnitFullFragment } from "../fragments";

export const GetGameQuery = gql`
  ${UnitFullFragment}
  query GetGame($gameId: Int!) {
    game(id: $gameId) {
      id
      status
      turnNumber
      currentPhase {
        id
        turnNumber
        name
        gamePlayer {
          player {
            minaPublicKey
          }
        }
        gamePieceActions {
          id
          gamePiece {
            id
          }
          actionType
        }
      }
      gamePlayers {
        player {
          minaPublicKey
        }
      }
      winningGamePlayer {
        player {
          minaPublicKey
        }
      }
      gamePieces {
        id
        gamePlayer {
          player {
            minaPublicKey
          }
        }
        playerUnit {
          id
          name
          unit {
            ...UnitFull
          }
        }
        coordinates {
          x
          y
        }
        gamePieceNumber
        health
      }
      arena {
        width
        height
      }
      previousPhase {
        name
        gamePlayer {
          player {
            minaPublicKey
          }
        }
        gamePieceActions {
          gamePiece {
            id
            playerUnit {
              name
              unit {
                name
              }
            }
            gamePlayer {
              player {
                minaPublicKey
              }
            }
          }
          actionType
          actionData {
            ... on GamePieceMoveAction {
              moveFrom { x, y }
              moveTo { x, y }
            }
            ... on GamePieceRangedAttackAction {
              resolvedAttack {
                hitRoll { roll, rollNeeded, success }
                woundRoll { roll, rollNeeded, success }
                saveRoll { roll, rollNeeded, success }
                damageDealt
                averageDamage
              }
              targetGamePiece {
                id
                health
                playerUnit {
                  name
                  unit {
                    name
                    maxHealth
                  }
                }
                gamePlayer {
                  player {
                    minaPublicKey
                  }
                }
              }
              totalDamageDealt
              totalDamageAverage
            }
            ... on GamePieceMeleeAttackAction {
              resolvedAttack {
                hitRoll { roll, rollNeeded, success }
                woundRoll { roll, rollNeeded, success }
                saveRoll { roll, rollNeeded, success }
                damageDealt
                averageDamage
              }
              targetGamePiece {
                id
                health
                playerUnit {
                  name
                  unit {
                    name
                    maxHealth
                  }
                }
                gamePlayer {
                  player {
                    minaPublicKey
                  }
                }
              }
              totalDamageDealt
              totalDamageAverage
            }
          }
        }
      }
    }
  }
`;
