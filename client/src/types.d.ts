type Player = {
  id: number;
  name: string;
  minaPublicKey: string;
}

type Unit = {
  id: number;
  name: string;
  attackPower: number;
  armor: number;
  maxHealth: number;
  movementSpeed: number;
};

<<<<<<< Updated upstream
=======
type Draftee = {
  unit: Unit;
  name: string;
  player: string;
}

>>>>>>> Stashed changes
type PlayerUnit = {
  id: number;
  player: Player;
  name: string;
  unit: Unit;
};

type Squad = {
  units: Unit[];
  playerUnits: [];
}