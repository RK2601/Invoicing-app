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
    CREATE TABLE IF NOT EXISTS invoices (
      id SERIAL PRIMARY KEY,
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

  console.log('Migrations complete!');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
