const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { eq } = require('drizzle-orm');
const { invoices } = require('../models/schema');

function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

// GET all invoices
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const all = await db.select().from(invoices).orderBy(invoices.created_at);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single invoice
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(invoices).where(eq(invoices.id, parseInt(req.params.id)));
    if (!result.length) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create invoice
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(invoices).values(req.body).returning();
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update invoice
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .update(invoices)
      .set({ ...req.body, updated_at: new Date() })
      .where(eq(invoices.id, parseInt(req.params.id)))
      .returning();
    if (!result.length) return res.status(404).json({ error: 'Invoice not found' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE invoice
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .delete(invoices)
      .where(eq(invoices.id, parseInt(req.params.id)))
      .returning();
    if (!result.length) return res.status(404).json({ error: 'Invoice not found' });
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
