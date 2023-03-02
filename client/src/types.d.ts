type Unit = {
  id: number!;
  name: string!;
  attackPower: number!;
  armor: number!;
  maxHealth: number!;
  movementSpeed: number!;
};

type PlayerUnit = {
  id: number!;
  player: string!;
  name: string;
  unit: Unit!;
};

type Squad = {
  units: Unit[];
  playerUnits: [];
}