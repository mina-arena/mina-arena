type Player = {
  id: number;
  name: string;
  minaPublicKey: string;
}

type Game = {
  id: number
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED'
}

type Unit = {
  id: number;
  name: string;
  attackPower: number;
  armor: number;
  maxHealth: number;
  movementSpeed: number;
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