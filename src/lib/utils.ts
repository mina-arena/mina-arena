const IMAGE_PATH_BY_UNIT_NAME: Record<string, string> = {
  'archer': '/images/archer.png',
  'peasant': '/images/peasant.png',
  'swordsman': '/images/swordsman.png',
  'spearman': '/images/spearman.png',
  'light cavalry': '/images/germanic_cavalry.png',
  'heavy cavalry': '/images/roman_heavy_cavalry.png',
  'ballista': '/images/ballista.png',
  'hero': '/images/hero.png',
};

const DEFAULT_UNIT_IMAGE_PATH = '/images/archer.png';

export const truncateMinaPublicKey = (key: string, front = 10, back = 10) => {
  return key.slice(0, front) + '...' + key.slice(key.length - back);
}

export const imagePathForUnit = (unit: Unit): string => {
  return IMAGE_PATH_BY_UNIT_NAME[unit.name.toLowerCase()] || DEFAULT_UNIT_IMAGE_PATH;
}
