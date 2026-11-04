import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { MongoClient, BSON } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const backupRoot = path.join(rootDir, 'backups');
const keep = Number(process.env.BACKUP_KEEP || 14);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/topex';
const dbName =
  process.env.MONGODB_DB_NAME ||
  new URL(uri).pathname.replace(/^\//, '') ||
  'topex';

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.join(backupRoot, stamp);

const redact = (value) => value.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

try {
  await client.connect();
  const db = client.db(dbName);
  const collections = (await db.listCollections().toArray())
    .map((item) => item.name)
    .filter((name) => !name.startsWith('system.'))
    .sort();

  fs.mkdirSync(backupDir, { recursive: true });

  const summary = [];
  for (const name of collections) {
    const docs = await db.collection(name).find({}).toArray();
    const file = path.join(backupDir, `${name}.json`);
    fs.writeFileSync(file, BSON.EJSON.stringify(docs, null, 2, { relaxed: false }), 'utf8');
    summary.push({ collection: name, count: docs.length });
    console.log(`  ${name}: ${docs.length}`);
  }

  fs.writeFileSync(
    path.join(backupDir, '_meta.json'),
    JSON.stringify(
      {
        database: dbName,
        uri: redact(uri),
        createdAt: new Date().toISOString(),
        collections: summary,
        totalDocuments: summary.reduce((sum, item) => sum + item.count, 0),
      },
      null,
      2,
    ),
    'utf8',
  );

  console.log(`\nBackup saved: ${backupDir}`);

  if (keep > 0) {
    const oldBackups = fs
      .readdirSync(backupRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
      .slice(0, -keep);
    for (const name of oldBackups) {
      fs.rmSync(path.join(backupRoot, name), { recursive: true, force: true });
      console.log(`Removed old backup: ${name}`);
    }
  }
} catch (error) {
  console.error('Backup failed:', error.message);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
