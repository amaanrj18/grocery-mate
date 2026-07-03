const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

router.get('/:categoryId', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM items WHERE category_id = ? AND user_id = ?';
  db.query(sql, [req.params.categoryId, req.user.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});

router.post('/', verifyToken, (req, res) => {
  const { name, quantity, unit, category_id } = req.body;
  if (!name || !category_id) return res.status(400).json({ message: 'Name and category required' });

  const sql = 'INSERT INTO items (name, quantity, unit, category_id, user_id) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, quantity || 1, unit || 'piece', category_id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.status(201).json({ id: result.insertId, name, quantity, unit, category_id });
  });
});

router.patch('/:id/check', verifyToken, (req, res) => {
  const sql = 'UPDATE items SET is_checked = NOT is_checked WHERE id = ? AND user_id = ?';
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Item updated' });
  });
});

router.delete('/:id', verifyToken, (req, res) => {
  const sql = 'DELETE FROM items WHERE id = ? AND user_id = ?';
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  });
});

module.exports = router;