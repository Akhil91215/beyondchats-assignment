const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./articles.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      is_updated INTEGER DEFAULT 0
    )
  `);
});

/* CREATE */
app.post('/api/articles', (req, res) => {
  const { title, content } = req.body;
  db.run(
    'INSERT INTO articles (title, content) VALUES (?, ?)',
    [title, content],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

/* READ */
app.get('/api/articles', (req, res) => {
  db.all('SELECT * FROM articles', (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* UPDATE */
app.put('/api/articles/:id', (req, res) => {
  const { content } = req.body;
  db.run(
    'UPDATE articles SET content = ?, is_updated = 1 WHERE id = ?',
    [content, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ updated: this.changes });
    }
  );
});

/* DELETE */
app.delete('/api/articles/:id', (req, res) => {
  db.run(
    'DELETE FROM articles WHERE id = ?',
    req.params.id,
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    }
  );
});

app.listen(8000, () => {
  console.log('Backend running at http://localhost:8000');
});
