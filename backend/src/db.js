import { LowSync, JSONFileSync } from 'lowdb';

const adapter = new JSONFileSync('db.json');
const db = new LowSync(adapter);

db.read();
db.data ||= { votes: [] };
db.write();