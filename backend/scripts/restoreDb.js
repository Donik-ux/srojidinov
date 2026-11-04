import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { MongoClient, BSON } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const backupRoot = path.join(rootDir, 'backups');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/topex';
const dbName =
  process.env.MONGODB_DB_NAME ||
  new URL(uri).pathname.replace(/^\//, '') ||
  'topex';

const args = process.argv.slice(2);
const drop = args.includes('--drop');
const dirArg = args.find((arg) => !arg.startsWith('--'));

const resolveBackupDir = () => {
  if (dirArg) return path.resolve(dirArg);
  if (!fs.existsSync(backupRoot)) return null;
  const latest = fs
    .readdirSync(backupRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .at(-1);
  return latest ? path.join(backupRoot, latest) : null;
};

const backupDir = resolveBackupDir();

if (!backupDir || !fs.existsSync(backupDir)) {
  console.error('Backup folder not found. Usage: npm run db:restore -- <backup-dir> [--drop]');
  process.exit(1);
}

console.log(`Restore from: ${backupDir}`);
if (drop) console.log('Mode: --drop (collections will be cleared first)');

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

try {
  await client.connect();
  const db = client.db(dbName);
  const files = fs
    .readdirSync(backupDir)
    .filter((name) => name.endsWith('.json') && name !== '_meta.json')
    .sort();

  for (const file of files) {
    const name = path.basename(file, '.json');
    const docs = BSON.EJSON.parse(fs.readFileSync(path.join(backupDir, file), 'utf8'));
    if (!Array.isArray(docs) || docs.length === 0) {
      console.log(`  ${name}: empty, skipped`);
      continue;
    }
    if (drop) await db.collection(name).deleteMany({});
    await db.collection(name).insertMany(docs);
    console.log(`  ${name}: restored ${docs.length}`);
  }

  console.log('\nRestore finished.');
} catch (error) {
  console.error('Restore failed:', error.message);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
