// Placeholder encryption utilities (for demo; replace with real E2E implementation)
export async function encryptMessage(plainText) {
  // TODO: implement using SubtleCrypto with counselor's public key
  return btoa(unescape(encodeURIComponent(plainText)))
}

export async function decryptMessage(cipherText) {
  // TODO: implement using SubtleCrypto with user's private key
  try {
    return decodeURIComponent(escape(atob(cipherText)))
  } catch {
    return cipherText
  }
}
