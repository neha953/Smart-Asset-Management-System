# Aegis AssetOps — Smart Asset Management System

An enterprise-grade web application for tracking, assigning, and managing an organization's IT assets — built with an industry-oriented approach rather than a purely academic one.

## Overview

Aegis AssetOps helps organizations move away from manual, spreadsheet-based asset tracking. It provides a centralized platform to register IT assets, assign them to employees, monitor maintenance and warranty status, calculate depreciation, and maintain a fully automated audit trail — with role-based access control and automated email alerts built in.

## Key Features

- **Asset Registration** with automatic QR code generation (each code links directly to the asset's record)
- **Employee Management** and **Asset Assignment** with full history tracking
- **Maintenance Scheduling** and service history
- **Warranty & Software License Tracking** with automated expiry alerts
- **Depreciation Reports** calculated using the straight-line method
- **Inventory Dashboard** with real-time statistics and a visual status chart
- **Automatic Audit Logging** — every create/update/delete action is recorded, no manual entry required
- **Role-Based Access Control** — Admin, Sub-Admin (view-only), Report Viewer, and Reader roles
- **User Management** and a Permissions overview page
- **Automated Email Alerts** for expiring warranties/licenses and upcoming asset returns, sent to both the assigned employee and the admin
- **Bulk CSV Import/Export** for asset inventory
- **Global Search**, **Dark Mode**, and a professional, responsive UI

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL (with connection pooling) |
| Authentication | JWT |
| Password Security | bcrypt |
| Security | Helmet, express-rate-limit |
| Automation | node-cron, Nodemailer |
| QR Codes | qrcode |
| Charts | Chart.js |
| Icons | Lucide Icons |

## Database Design

The database (`smart_asset_db`) contains 10 normalized tables (1NF–4NF): `users`, `categories`, `vendors`, `employees`, `assets`, `assignments`, `maintenance`, `software_licenses`, `warranties`, and `audit_logs`, connected through One-to-Many foreign key relationships. Full schema is in [`Database/schema.sql`](Database/schema.sql).

## Getting Started

### Prerequisites
- Node.js
- MySQL (via XAMPP or standalone)

### Installation

```bash
git clone https://github.com/neha953/Smart-Asset-Management-System.git
cd Smart-Asset-Management-System
npm install
```

Import `Database/schema.sql` into MySQL to create the database.

Create a `.env` file in the project root:

PORT=5000
JWT_SECRET=your_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key
APP_BASE_URL=http://localhost:5000


Start the server:

```bash
npm run dev
```

Visit `http://localhost:5000` in your browser.

## Project Structure

backend/ → Express server, controllers, models, routes, middleware
Frontend/ → HTML/CSS/JS pages
Database/ → SQL schema
documentation/ → SRS, Technical Documentation, User Manual, ER Diagram


## Documentation

- [Software Requirements Specification](documentation/SRS.docx)
- [Technical Documentation](documentation/Technical_Documentation.docx)
- [User Manual](documentation/User_Manual.docx)
- [UI/UX Design](documentation/UI_UX_Design.docx)
- [ER Diagram](documentation/ER_Diagram.png)

## Author

**Neha Valecha**
BS Computer Science, SZABIST Gharo Campus
Developed as part of the PrimXact Internship Program

## License

This project was developed for internship and academic purposes
