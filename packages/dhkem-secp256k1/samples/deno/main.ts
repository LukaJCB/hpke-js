import { Aes128Gcm, CipherSuite, HkdfSha256 } from "@hpke/core";
import { DhkemSecp256k1HkdfSha256 } from "@hpke/dhkem-secp256k1";

async function doHpke() {
  // setup
  const suite = new CipherSuite({
    kem: new DhkemSecp256k1HkdfSha256(),
    kdf: new HkdfSha256(),
    aead: new Aes128Gcm(),
  });

  const rkp = await suite.kem.generateKeyPair();

  const sender = await suite.createSenderContext({
    recipientPublicKey: rkp.publicKey,
  });

  const recipient = await suite.createRecipientContext({
    recipientKey: rkp.privateKey,
    enc: sender.enc,
  });

  // encrypt
  const ct = await sender.seal(
    new TextEncoder().encode("Hello world!").buffer as ArrayBuffer,
  );

  // decrypt
  const pt = await recipient.open(ct);

  // Hello world!
  console.log(new TextDecoder().decode(pt));
}

try {
  doHpke();
} catch (err: unknown) {
  console.log("Error: ", err as Error);
}
