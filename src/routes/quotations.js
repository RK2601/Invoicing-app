const express = require('express');
const router = express.Router();
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { eq, desc } = require('drizzle-orm');
const { quotations } = require('../models/schema');
const { authMiddleware } = require('../middleware/auth');

function getDb() {
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql);
}

// GET all quotations for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const all = await db.select().from(quotations)
      .where(eq(quotations.user_id, req.user.id))
      .orderBy(desc(quotations.created_at));
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single quotation (must belong to user)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.select().from(quotations).where(eq(quotations.id, parseInt(req.params.id)));
    if (!result.length) return res.status(404).json({ error: 'Quotation not found' });
    if (result[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create quotation — requires auth, attaches user_id
router.post('/', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.insert(quotations).values({
      ...req.body,
      user_id: req.user.id,
    }).returning();
    res.status(201).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update quotation
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const db = getDb();
    const existing = await db.select().from(quotations).where(eq(quotations.id, parseInt(req.params.id)));
    if (!existing.length) return res.status(404).json({ error: 'Quotation not found' });
    if (existing[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const result = await db.update(quotations)
      .set({ ...req.body, updated_at: new Date() })
      .where(eq(quotations.id, parseInt(req.params.id)))
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE quotation
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const existing = await db.select().from(quotations).where(eq(quotations.id, parseInt(req.params.id)));
    if (!existing.length) return res.status(404).json({ error: 'Quotation not found' });
    if (existing[0].user_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await db.delete(quotations).where(eq(quotations.id, parseInt(req.params.id)));
    res.json({ message: 'Quotation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
