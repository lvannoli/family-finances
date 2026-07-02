// Orchestrates encrypted pull/push of the data envelope and tracks the remote sha.
export class SyncEngine {
  constructor({ client, passphrase, crypto, deviceId }) {
    this.client = client;
    this.passphrase = passphrase;
    this.crypto = crypto;
    this.deviceId = deviceId;
    this.sha = null;
  }

  async pull() {
    const remote = await this.client.getFile();
    if (!remote) { this.sha = null; return null; }
    const envelope = await this.crypto.decryptJSON(remote.json, this.passphrase);
    this.sha = remote.sha;
    return envelope;
  }

  async push(data, updatedAt) {
    const envelope = { version: 1, updatedAt, deviceId: this.deviceId, data };
    const cryptoEnvelope = await this.crypto.encryptJSON(envelope, this.passphrase);
    const result = await this.client.putFile(cryptoEnvelope, this.sha);
    this.sha = result.sha;
    return envelope;
  }
}
