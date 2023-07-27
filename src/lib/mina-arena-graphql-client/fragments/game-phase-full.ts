import { gql } from "@apollo/client/core/index.js"

export const GamePhaseFullFragment = gql`
  fragment GamePhaseFull on GamePhase {
    id
    name
    turnNumber
    gamePlayer {
      player {
        minaPublicKey
      }
    }
    initialPhaseState,
    finalPhaseState,
    gamePieceActions {
      id
      actionType
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
          rollInput
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
          rollInput
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
`;