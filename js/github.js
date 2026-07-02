// Minimal GitHub Contents API client for a single file in a repo.
const API = 'https://api.github.com';

function encodeContent(obj) {
  // envelope JSON is ASCII (base64 fields), but encode UTF-8-safe regardless
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)));
}
function decodeContent(b64) {
  const clean = b64.replace(/\n/g, '');
  return JSON.parse(decodeURIComponent(escape(atob(clean))));
}

export class GitHubClient {
  constructor({ owner, repo, token, path = 'data.json.enc' }) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.path = path;
  }

  _url() {
    return `${API}/repos/${this.owner}/${this.repo}/contents/${this.path}`;
  }

  _headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async getFile() {
    const res = await fetch(this._url(), { headers: this._headers() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GITHUB_GET_${res.status}`);
    const body = await res.json();
    return { json: decodeContent(body.content), sha: body.sha };
  }

  async putFile(obj, sha) {
    const body = {
      message: `sync ${new Date().toISOString()}`,
      content: encodeContent(obj),
    };
    if (sha) body.sha = sha;
    const res = await fetch(this._url(), {
      method: 'PUT',
      headers: { ...this._headers(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 409 || res.status === 422) throw new Error('CONFLICT');
    if (!res.ok) throw new Error(`GITHUB_PUT_${res.status}`);
    const rb = await res.json();
    return { sha: rb.content.sha };
  }
}
