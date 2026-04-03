# WiseMatic Invoice & Quotation Generator

A professional web application for generating invoices and quotations with live preview and PDF export functionality.

## Features

- **Invoice Generator**: Create professional invoices with company branding, line items, taxes (GST/HST), discounts, and payment details
- **Quotation Generator**: Generate project quotes with deliverables, terms & conditions, and pricing estimates
- **Live Preview**: Real-time A4 document preview as you edit
- **Logo & Signature Upload**: Add your company logo and signature image
- **PDF Download**: Export documents as PDF files
- **Dark Theme UI**: Modern editor interface with split-panel layout

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Database**: Neon PostgreSQL (coming soon)
- **PDF Generation**: html2canvas + jsPDF

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wisematic-invoicing.git
cd wisematic-invoicing
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your Neon PostgreSQL connection string
```

4. Run the application:
```bash
npm start
```

The app will be available at `http://localhost:3000`

## Database Setup

This application uses Neon PostgreSQL for data storage. To set up:

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project and database
3. Copy the connection string to your `.env` file
4. Run the database migrations:
```bash
npm run db:migrate
```

## Project Structure

```
wisematic-invoicing/
├── public/
│   └── index.html          # Main application file
├── src/
│   ├── server.js           # Express server
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   └── utils/              # Utility functions
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints (Coming Soon)

- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/quotations` - Create a new quotation
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/:id` - Get quotation by ID
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

WiseMatic - [Sales@wisematic.ca](mailto:Sales@wisematic.ca)

Project Link: [https://github.com/yourusername/wisematic-invoicing](https://github.com/yourusername/wisematic-invoicing)