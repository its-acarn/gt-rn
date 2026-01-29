export const generateId = (): string => {
  // Use globalThis.crypto which is available in Hermes
  const globalCrypto = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;

  if (globalCrypto?.randomUUID) {
    return globalCrypto.randomUUID();
  }

  return `local-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
};
