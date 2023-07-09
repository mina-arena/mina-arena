export const truncateMinaPublicKey = (key: string, front = 10, back = 10) => {
  return key.slice(0, front) + '...' + key.slice(key.length - back);
}