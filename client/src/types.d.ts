type Player = {
  id: number;
  name: string;
  minaPublicKey: string;
}

type Game = {
  id: number;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  turnNumber?: number;
  currentPhase?: GamePhase;
  gamePlayers?: Array<GamePlayer>;
  winningGamePlayer?: GamePlayer;
  gamePieces: Array<GamePiece>;
  arena: {
    width: number;
    height: number;
  }
}

type GamePiece = {
  id: number;
  gamePlayer: GamePlayer;
  playerUnit: PlayerUnit;
  coordinates: {
    x: number;
    y: number
  }
  health: number;
}

type GamePhase = {
  id: number;
  name: string;
  gamePlayer: {
    player: {
      minaPublicKey: string;
    }
  }
  gamePieceActions: {
    id: number;
    gamePiece: {
      id: number;
    }
    actionType: 'MOVEMENT'
  }
}

type GamePlayer = {
  player: Player;
  gamePieces?: [{
    gamePlayer: GamePlayer;
    playerUnit: PlayerUnit;
    coordinates: {
      x: number;
      y: number
    }
    health: number;
  }]
}

type Unit = {
  id: number;
  name: string;
  maxHealth: number;
  movementSpeed: number;
  armorSaveRoll: number;
  pointsCost: number;
  meleeNumAttacks: number;
  meleeHitRoll: number;
  meleeWoundRoll: number;
  meleeArmorPiercing: number;
  meleeDamage: number;
  rangedRange?: number;
  rangedNumAttacks?: number;
  rangedHitRoll?: number;
  rangedWoundRoll?: number;
  rangedArmorPiercing?: number;
  rangedDamage?: number;
  rangedAmmo?: number;
};

type Draftee = {
  unit: Unit;
  name: string;
  player: string;
}

type PlayerUnit = {
  id: number;
  player: Player;
  name: string;
  unit: Unit;
};

type Squad = {
  units: Draftee[];
  playerUnits: PlayerUnit[];
}

type CreateGamePieceInput = {
  playerUnitId: number
} | {
  createPlayerUnit: {
    unitId: number,
    name: string
  }
}

type DrawnPiece = {
  gamePieceId: number;
  x: number;
  y: number;
  radius: number;
  fill: string;
};

type GamePieceOrder = {
  move?: MoveAction;
  rangedAttack?: RangedAttackAction;
  meleeAttack?: MeleeAttackAction;
};

type MoveAction = {
  gamePieceId: number
  action: {
    moveFrom: {
      x: number;
      y: number;
    },
    moveTo: {
      x: number;
      y: number;
    }
  }
}

type RangedAttackAction = {
  gamePieceId: number;
  action: {
    targetGamePieceId: number;
    diceRoll: DiceRollInput;
  }
};

type MeleeAttackAction = {
  gamePieceId: number;
  action: {
    targetGamePieceId: number;
    diceRoll: DiceRollInput;
  }
};

type DiceRollInput = {
  publicKey: PublicKeyGroup;
  cipherText: string;
  signature: Signature;
};

type PublicKeyGroup = {
  x: string;
  y: string;
};

type Signature = {
  r: string;
  s: string;
}

type Point = {
  x: number;
  y: number;
}