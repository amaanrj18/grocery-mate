const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM categories WHERE user_id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

router.post('/', verifyToken, (req, res) => {
  const { name, emoji } = req.body;
  if (!name) return res.status(400).json({ message: 'Name required' });

  const sql = 'INSERT INTO categories (name, emoji, user_id) VALUES (?, ?, ?)';
  db.query(sql, [name, emoji, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(201).json({ id: result.insertId, name, emoji });
  });
});

router.delete('/:id', verifyToken, (req, res) => {
  const sql = 'DELETE FROM categories WHERE id = ? AND user_id = ?';
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  });
});

module.exports = router;