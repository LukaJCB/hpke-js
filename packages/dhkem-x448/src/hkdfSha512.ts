import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";

import { HkdfSha512Native } from "@hpke/common";

export class HkdfSha512 extends HkdfSha512Native {
  public override async extract(
    salt: ArrayBuffer,
    ikm: ArrayBuffer,
  ): Promise<ArrayBuffer> {
    await this._setup();
    if (salt.byteLength === 0) {
      salt = new ArrayBuffer(this.hashSize);
    }
    if (salt.byteLength !== this.hashSize) {
      return hmac(sha512, new Uint8Array(salt), new Uint8Array(ikm))
        .buffer as ArrayBuffer;
    }
    const key = await (this._api as SubtleCrypto).importKey(
      "raw",
      salt,
      this.algHash,
      false,
      [
        "sign",
      ],
    );
    return await (this._api as SubtleCrypto).sign("HMAC", key, ikm);
  }
}
