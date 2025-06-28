// implememnt caching logic for webflowForm
const Cache = new Map<string, any>();

export class SessionCache {
  private name: string;
  constructor(name: string) {
    this.name = name;
    if (!Cache.has(name)) {
      Cache.set(name, new Map<string, any>());
    }
  }

  get(key: string): any {
    const cache = Cache.get(this.name);
    if (cache) {
      return cache.get(key);
    }
    return null;
  }

  set(key: string, value: any): void {
    const cache = Cache.get(this.name);
    if (cache) {
      cache.set(key, value);
    }
  }

  clear(): void {
    Cache.delete(this.name);
  }

  has(key: string): boolean {
    const cache = Cache.get(this.name);
    if (cache) {
      return cache.has(key);
    }
    return false;
  }
}
