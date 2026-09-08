const path = require('path');
const fs   = require('fs');

let db = null;

async function initDatabase(userDataPath) {
  if (db) return;

  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();

  const dbPath = path.join(userDataPath, 'todo.db');

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS TodoItem (
      ID    INTEGER PRIMARY KEY AUTOINCREMENT,
      Name  TEXT    NOT NULL,
      Notes TEXT    DEFAULT '',
      Done  INTEGER DEFAULT 0
    )
  `);

  saveDatabase(userDataPath);
}

function saveDatabase(userDataPath) {
  const dbPath = path.join(userDataPath, 'todo.db');
  const data   = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

function getItems() {
  const result = db.exec('SELECT * FROM TodoItem');
  if (!result.length) return [];

  const columns = result[0].columns;
  return result[0].values.map(row => {
    const item = {};
    columns.forEach((col, i) => item[col] = row[i]);
    item.Done = item.Done === 1;
    return item;
  });
}

function saveItem(item, userDataPath) {
  if (item.ID) {
    db.run(
      'UPDATE TodoItem SET Name=?, Notes=?, Done=? WHERE ID=?',
      [item.Name, item.Notes || '', item.Done ? 1 : 0, item.ID]
    );
  } else {
    db.run(
      'INSERT INTO TodoItem (Name, Notes, Done) VALUES (?, ?, ?)',
      [item.Name, item.Notes || '', item.Done ? 1 : 0]
    );
  }
  saveDatabase(userDataPath);
}

function deleteItem(id, userDataPath) {
  db.run('DELETE FROM TodoItem WHERE ID=?', [id]);
  saveDatabase(userDataPath);
}

module.exports = { initDatabase, getItems, saveItem, deleteItem };