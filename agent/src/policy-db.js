/**
 * policy-db.js — Policy Database Manager
 *
 * Loads, searches, and manages the policy database.
 * Supports: load, search, add, update, getStats, export.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'db', 'policies.json');

class PolicyDB {
  #data = null;
  #path;

  constructor(dbPath) {
    this.#path = dbPath || DB_PATH;
    this.load();
  }

  load() {
    if (!existsSync(this.#path)) {
      throw new Error(`Policy database not found: ${this.#path}`);
    }
    const raw = readFileSync(this.#path, 'utf-8');
    this.#data = JSON.parse(raw);
    return this;
  }

  /** Get all policies */
  getAll() {
    return this.#data.policies || [];
  }

  /** Get policy by ID */
  getById(id) {
    return this.getAll().find(p => p.id === id) || null;
  }

  /** Search policies by keyword (matches name, tags, region, industry, authority) */
  search(query) {
    if (!query || query.trim() === '') return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(p => {
      const haystack = [
        p.name, p.region, p.level, p.issuing_authority,
        p.subsidy_description,
        ...(p.industry_tags || []),
        ...(p.stage_tags || []),
        ...(p.tags || []),
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }

  /** Filter policies by criteria */
  filter({ region, industry, level, minScore } = {}) {
    let results = this.getAll();
    if (region) {
      results = results.filter(p =>
        p.region === region || p.region === '全国' || region.includes(p.region)
      );
    }
    if (industry) {
      results = results.filter(p =>
        (p.industry_tags || []).includes(industry)
      );
    }
    if (level) {
      results = results.filter(p => p.level === level);
    }
    return results;
  }

  /** Add a new policy */
  addPolicy(policy) {
    if (!policy.id) {
      policy.id = `USR-${Date.now()}`;
    }
    if (this.getById(policy.id)) {
      throw new Error(`Policy with id '${policy.id}' already exists`);
    }
    this.#data.policies.push(policy);
    this.#data.$updated = new Date().toISOString().split('T')[0];
    this.#save();
    return policy;
  }

  /** Update an existing policy by ID */
  updatePolicy(id, updates) {
    const idx = this.#data.policies.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Policy not found: ${id}`);
    this.#data.policies[idx] = { ...this.#data.policies[idx], ...updates };
    this.#data.$updated = new Date().toISOString().split('T')[0];
    this.#save();
    return this.#data.policies[idx];
  }

  /** Get database statistics */
  getStats() {
    const policies = this.getAll();
    const levels = {};
    const industries = new Set();
    const regions = new Set();

    policies.forEach(p => {
      levels[p.level] = (levels[p.level] || 0) + 1;
      (p.industry_tags || []).forEach(t => industries.add(t));
      if (p.region) regions.add(p.region);
    });

    return {
      total_policies: policies.length,
      by_level: levels,
      industries_covered: industries.size,
      industries_list: [...industries].sort(),
      regions_covered: regions.size,
      regions_list: [...regions].sort(),
      db_version: this.#data.$version,
      last_updated: this.#data.$updated,
    };
  }

  /** Export full database as JSON string */
  export() {
    return JSON.stringify(this.#data, null, 2);
  }

  #save() {
    writeFileSync(this.#path, JSON.stringify(this.#data, null, 2), 'utf-8');
  }
}

// Singleton instance
let _instance = null;
export function getDB(path) {
  if (!_instance) _instance = new PolicyDB(path);
  return _instance;
}

export { PolicyDB };
