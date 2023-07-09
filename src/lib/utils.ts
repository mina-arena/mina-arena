export const truncateMinaPublicKey = (key: string, front = 10, back = 10) => {
  return key.slice(0, front) + '...' + key.slice(key.length - back);
}

export const unitImage = (unitName: string): string => {
  unitName = unitName.toLowerCase();
  switch (unitName) {
    case 'archer':
      return '/images/archer.png';
    case 'spearman':
      return '/images/spearman.png';
    case 'heavy cavalry':
      return '/images/heavy_cavalry.png';
    default:
      return '/images/archer.png';
  }
}