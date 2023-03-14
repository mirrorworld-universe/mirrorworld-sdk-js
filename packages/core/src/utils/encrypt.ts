/**
 * Encrypts a message using the public key
 * @param message
 * @returns
 */
export const digest = async (message: string): Promise<string> =>
  Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message))
      ),
      (x) => ('0' + x.toString(16)).slice(-2)
    )
    .join('');
