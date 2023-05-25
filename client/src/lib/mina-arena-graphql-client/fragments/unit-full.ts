import { gql } from "@apollo/client/core/index.js"

export const UnitFullFragment = gql`
  fragment UnitFull on Unit {
    id
    name
    pointsCost
    maxHealth
    movementSpeed
    armorSaveRoll
    meleeNumAttacks
    meleeHitRoll
    meleeWoundRoll
    meleeArmorPiercing
    meleeDamage
    rangedRange
    rangedNumAttacks
    rangedHitRoll
    rangedWoundRoll
    rangedArmorPiercing
    rangedDamage
    rangedAmmo
  }
`;
