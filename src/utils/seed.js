require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { invoices, quotations } = require('../models/schema');

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log('Seeding database...');

  await db.insert(invoices).values({
    invoice_number: 'INV-001',
    company_name: 'WiseMatic Inc.',
    company_address: '123 Business Ave, Toronto, ON M5V 2K3',
    company_phone: '+1 (416) 555-0100',
    company_email: 'sales@wisematic.ca',
    company_website: 'wisematic.ca',
    issue_date: '2024-01-01',
    due_date: '2024-01-31',
    customer_name: 'Sample Client Corp',
    customer_address: '456 Client St, Vancouver, BC V6B 2W9',
    customer_phone: '+1 (604) 555-0200',
    customer_email: 'billing@sampleclient.com',
    services: JSON.stringify([
      { name: 'Web Design', desc: 'Full website design and development', qty: 1, rate: 2000 },
      { name: 'SEO Setup', desc: 'Search engine optimization configuration', qty: 1, rate: 500 },
    ]),
    gst_percent: '5.00',
    hst_percent: '0.00',
    discount: '0.00',
    bank_name: 'Royal Bank of Canada',
    account_number: '1234567',
    transit_number: '00123',
    institution_number: '003',
    director_name: 'Jane Doe',
    director_title: 'Managing Director',
  });

  await db.insert(quotations).values({
    quote_number: 'QUO-001',
    company_name: 'WiseMatic Inc.',
    company_address: '123 Business Ave, Toronto, ON M5V 2K3',
    company_phone: '+1 (416) 555-0100',
    company_email: 'sales@wisematic.ca',
    company_website: 'wisematic.ca',
    quote_date: '2024-01-01',
    valid_until: '2024-01-31',
    project_type: 'Web Development',
    client_name: 'Prospect Company Ltd.',
    contact_person: 'John Smith',
    client_address: '789 Prospect Blvd, Calgary, AB T2P 1J9',
    client_email: 'john@prospect.com',
    intro_text: 'Thank you for considering WiseMatic for your project. We are pleased to present this quotation.',
    terms: 'Payment due within 30 days of invoice.\n50% deposit required to begin work.\nAll deliverables subject to final approval.',
    services: JSON.stringify([
      { name: 'Discovery & Planning', desc: 'Requirements gathering and project scoping', qty: 8, rate: 150 },
      { name: 'UI/UX Design', desc: 'Wireframes, mockups, and design system', qty: 20, rate: 120 },
      { name: 'Development', desc: 'Frontend and backend implementation', qty: 40, rate: 130 },
    ]),
    gst_percent: '5.00',
    hst_percent: '0.00',
    discount: '0.00',
    director_name: 'Jane Doe',
    director_title: 'Managing Director',
  });

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
