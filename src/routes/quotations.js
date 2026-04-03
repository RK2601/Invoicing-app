const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { eq } = require('drizzle-orm');
const { quotations } = require('../models/schema');

function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

// GET all quotations
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const all = await db.select().from(quotations).orderBy(quotations.created_at);
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single quotation
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(quotations).where(eq(quotations.id, parseInt(req.params.id)));
    if (!result.length) return res.status(404).json({ error: 'Quotation not found' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create quotation
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(quotations).values(req.body).returning();
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update quotation
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .update(quotations)
      .set({ ...req.body, updated_at: new Date() })
      .where(eq(quotations.id, parseInt(req.params.id)))
      .returning();
    if (!result.length) return res.status(404).json({ error: 'Quotation not found' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE quotation
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db
      .delete(quotations)
      .where(eq(quotations.id, parseInt(req.params.id)))
      .returning();
    if (!result.length) return res.status(404).json({ error: 'Quotation not found' });
    res.json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
