class TokenCache {
  constructor() {
    this.token = null;
    this.expiry = null;
  }

  set(token, expiresIn) {
    this.token = token;
    this.expiry = Date.now() + (expiresIn * 1000);
  }

  get() {
    return this.token;
  }

  isValid() {
    return this.token && this.expiry && Date.now() < this.expiry;
  }

  clear() {
    this.token = null;
    this.expiry = null;
  }
}

export const tokenCache = new TokenCache();