const IMAGE_PATH_BY_UNIT_NAME: Record<string, string> = {
  'archer': '/images/archer.png',
  'peasant': '',
  'swordsman': '',
  'spearman': '/images/spearman.png',
  'light cavalry': '',
  'heavy cavalry': '/images/heavy_cavalry.png',
  'ballista': '',
  'hero': '',
};

const DEFAULT_UNIT_IMAGE_PATH = '/images/archer.png';

export const truncateMinaPublicKey = (key: string, front = 10, back = 10) => {
  return key.slice(0, front) + '...' + key.slice(key.length - back);
}

export const imagePathForUnit = (unit: Unit): string => {
  return IMAGE_PATH_BY_UNIT_NAME[unit.name.toLowerCase()] || DEFAULT_UNIT_IMAGE_PATH;
}
