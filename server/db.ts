import fs from 'fs';
import os from 'os';
import path from 'path';
import { createSeedDatabase } from '../src/data/seedData';
import type { AppDatabase } from '../src/types/travel';

const BUNDLED_DATA_DIR = path.resolve(process.cwd(), '.data');
const BUNDLED_DB_FILE = path.join(BUNDLED_DATA_DIR, 'sidi-db.json');
const TMP_DB_FILE = path.join(os.tmpdir(), 'sidi-db.json');

function isValidDatabase(parsed: unknown): parsed is AppDatabase {
  if (!parsed || typeof parsed !== 'object') return false;
  const candidate = parsed as Partial<AppDatabase>;
  return Array.isArray(candidate.packages) && Array.isArray(candidate.bookings);
}

function readJsonFile(filePath: string): AppDatabase | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    return isValidDatabase(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isServerlessReadOnly(): boolean {
  if (process.env.VERCEL === '1' || process.env.NOW_REGION) return true;
  try {
    if (!fs.existsSync(BUNDLED_DATA_DIR)) {
      fs.mkdirSync(BUNDLED_DATA_DIR, { recursive: true });
    }
    fs.accessSync(BUNDLED_DATA_DIR, fs.constants.W_OK);
    return false;
  } catch {
    return true;
  }
}

export function loadDatabase(): AppDatabase {
  if (isServerlessReadOnly()) {
    const warm = readJsonFile(TMP_DB_FILE);
    if (warm) return warm;

    const bundled = readJsonFile(BUNDLED_DB_FILE);
    const initial = bundled ?? createSeedDatabase();
    saveDatabase(initial);
    return initial;
  }

  const local = readJsonFile(BUNDLED_DB_FILE);
  if (local) return local;

  const seeded = createSeedDatabase();
  saveDatabase(seeded);
  return seeded;
}

export function saveDatabase(db: AppDatabase): void {
  const payload = JSON.stringify(db, null, 2);

  if (isServerlessReadOnly()) {
    try {
      fs.writeFileSync(TMP_DB_FILE, payload, 'utf-8');
    } catch (err) {
      console.error('Failed to persist temporary database:', err);
    }
    return;
  }

  try {
    if (!fs.existsSync(BUNDLED_DATA_DIR)) {
      fs.mkdirSync(BUNDLED_DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(BUNDLED_DB_FILE, payload, 'utf-8');
  } catch (err) {
    console.error('Failed to persist database:', err);
  }
}
