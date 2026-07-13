/**
 * Import database backup from ZIP into MongoDB Atlas.
 * Usage: node scripts/import-backup.mjs <path-to-zip>
 */
import { existsSync, mkdirSync, readdirSync, statSync, readFileSync } from 'fs';
import { resolve, join, basename, extname } from 'path';
import { MongoClient } from 'mongodb';
import { execSync } from 'child_process';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'alphabit_shop_replit';

if (!MONGO_URL) {
  console.error('❌ MONGO_URL env not set');
  process.exit(1);
}

const zipPath = process.argv[2];
if (!zipPath || !existsSync(zipPath)) {
  console.error(`❌ File not found: ${zipPath}`);
  process.exit(1);
}

const tmpDir = join(tmpdir(), 'backup-' + randomBytes(4).toString('hex'));
mkdirSync(tmpDir, { recursive: true });

console.log(`📦 Extracting ${zipPath} → ${tmpDir}`);
execSync(`unzip -q "${resolve(zipPath)}" -d "${tmpDir}"`, { stdio: 'inherit' });

// Find directory containing data files
function findDataDir(dir, depth = 0) {
  if (depth > 5) return null;
  const entries = readdirSync(dir);
  const hasBson = entries.some(e => e.endsWith('.bson'));
  const hasJson = entries.some(e => e.endsWith('.json') && !e.includes('metadata'));
  if (hasBson || hasJson) return dir;
  for (const entry of entries) {
    const sub = join(dir, entry);
    if (statSync(sub).isDirectory()) {
      const found = findDataDir(sub, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

const dataDir = findDataDir(tmpDir);
if (!dataDir) {
  console.error('❌ No BSON or JSON files found in ZIP');
  // Show what's in the zip
  console.log('ZIP contents:');
  execSync(`find "${tmpDir}" -type f | head -30`, { stdio: 'inherit' });
  process.exit(1);
}
console.log(`📂 Data directory: ${dataDir}`);

const client = new MongoClient(MONGO_URL);
await client.connect();
const db = client.db(DB_NAME);
console.log(`✅ Connected to MongoDB — database: ${DB_NAME}\n`);

const entries = readdirSync(dataDir);
const collections = [...new Set(
  entries
    .filter(e => e.endsWith('.bson') || (e.endsWith('.json') && !e.includes('metadata')))
    .map(e => basename(e, extname(e)))
)];

console.log(`📋 Collections found: ${collections.join(', ')}\n`);

for (const collName of collections) {
  const bsonFile = join(dataDir, `${collName}.bson`);
  const jsonFile = join(dataDir, `${collName}.json`);

  let docs = [];

  if (existsSync(bsonFile)) {
    // Parse BSON file
    const { BSON } = await import('bson');
    const buf = readFileSync(bsonFile);
    let offset = 0;
    while (offset < buf.length) {
      const size = buf.readInt32LE(offset);
      if (size <= 4 || offset + size > buf.length) break;
      const docBuf = buf.subarray(offset, offset + size);
      try { docs.push(BSON.deserialize(docBuf)); } catch {}
      offset += size;
    }
  } else if (existsSync(jsonFile)) {
    const raw = readFileSync(jsonFile, 'utf8').trim();
    if (raw.startsWith('[')) {
      docs = JSON.parse(raw);
    } else {
      docs = raw.split('\n').filter(Boolean).map(l => {
        try { return JSON.parse(l); } catch { return null; }
      }).filter(Boolean);
    }
  }

  if (!docs.length) {
    console.log(`⚠️  ${collName}: 0 documenti — skip`);
    continue;
  }

  const coll = db.collection(collName);
  const existing = await coll.countDocuments();
  if (existing > 0) {
    console.log(`🗑️  ${collName}: drop ${existing} documenti esistenti`);
    await coll.drop();
  }

  try {
    const result = await coll.insertMany(docs, { ordered: false });
    console.log(`✅ ${collName}: ${result.insertedCount}/${docs.length} documenti importati`);
  } catch (e) {
    console.log(`⚠️  ${collName}: import parziale — ${e.message}`);
  }
}

await client.close();
console.log('\n🎉 Import completato!');
