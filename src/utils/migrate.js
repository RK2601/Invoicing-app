require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

async function runMigrations() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  console.log('Running migrations...');

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      invoice_number TEXT NOT NULL,
      company_name TEXT,
      company_address TEXT,
      company_address2 TEXT,
      company_phone TEXT,
      company_email TEXT,
      company_website TEXT,
      issue_date TEXT,
      due_date TEXT,
      customer_name TEXT,
      customer_address TEXT,
      customer_phone TEXT,
      customer_email TEXT,
      services JSONB,
      gst_percent NUMERIC(5,2),
      hst_percent NUMERIC(5,2),
      discount NUMERIC(10,2),
      bank_name TEXT,
      account_number TEXT,
      transit_number TEXT,
      institution_number TEXT,
      director_name TEXT,
      director_title TEXT,
      logo_data TEXT,
      signature_data TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS quotations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      quote_number TEXT NOT NULL,
      company_name TEXT,
      company_address TEXT,
      company_phone TEXT,
      company_email TEXT,
      company_website TEXT,
      quote_date TEXT,
      valid_until TEXT,
      project_type TEXT,
      client_name TEXT,
      contact_person TEXT,
      client_address TEXT,
      client_email TEXT,
      intro_text TEXT,
      terms TEXT,
      services JSONB,
      gst_percent NUMERIC(5,2),
      hst_percent NUMERIC(5,2),
      discount NUMERIC(10,2),
      director_name TEXT,
      director_title TEXT,
      logo_data TEXT,
      signature_data TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Add user_id column to existing tables if it doesn't exist
  await sql`
    ALTER TABLE invoices ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  `;
  await sql`
    ALTER TABLE quotations ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
  `;

  await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS billing_mode TEXT`;
  await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS billing_mode TEXT`;
  await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS bank_name TEXT`;
  await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS account_number TEXT`;
  await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS transit_number TEXT`;
  await sql`ALTER TABLE quotations ADD COLUMN IF NOT EXISTS institution_number TEXT`;

  console.log('Migrations complete!');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
