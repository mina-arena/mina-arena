export const truncateMinaPublicKey = (key: string, front = 10, back = 8) => {
  return key.slice(0, front) + '...' + key.slice(key.length - back);
}