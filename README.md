<h1>
  <img src="/public/favicon.ico" alt="MedKnight Logo" width="28" height="30" style="vertical-align: middle; margin-right: 10px;">
  <strong>MedKnight — Teleradiology Reporting SaaS Platform</strong>
</h1>

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/medknight-in/MedKnight.git
cd MedKnight  
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a .env.local file at the root of your project with the following:

```bash
# Authentication
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=your-auth-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Server
NEXT_PORT=3000

# Email Server (for passwordless auth or notifications)
EMAIL_SERVER_HOST=smtp.yourmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@example.com
EMAIL_SERVER_PASSWORD=your-email-password
EMAIL_FROM=your-email@example.com

# AWS S3 (for DICOM storage)
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
S3_BUCKET_NAME=your-s3-bucket-name
```

### 4. Run the App
```bash
npm run dev
```

---

## 📁 Project Structure

```bash
.
├── app/                # Application routes and pages
├── components/         # Shared UI components
├── lib/                # Auth, utilities, API helpers
├── prisma/             # Prisma schema and DB migrations
├── public/             # Static assets
├── types/              # Custom TypeScript types
.env.local              # Environment variables
middleware.ts           # NextAuth middleware
next.config.js          # Next.js configuration
README.md
```

---

## 🧪 Testing DICOM Flow

1. Hospital uploads DICOM studies via dashboard.

2. DICOM Server receives and stores images.

2. DICOM Viewer integrated for radiologist image analysis.

3. Radiologist writes findings via rich text report editor.

4. Report is saved in AWS S3 storage.

5. WebSocket/email notifies the hospitals once the report is ready.

---

## 🛡️ Deployment

✅ Frontend hosted on Vercel

✅ Dicom PACS on AWS EC2 (Windows Server)

✅ HTTPS via Nginx Reverse Proxy 

---

## 🚀 Features

### ✅ User Roles & Authentication
- Role-based access control using `NextAuth.js`
- Approval Workflow based Authorization  
- User Roles: **Admin**, **Radiologist**, **Hospital**

### 🖼️ DICOM Upload & PACS Integration
- DICOM Server integration
- DICOM file upload by hospitals
- Secure image storage in **AWS S3**
- Real-time rendering and analysis via **Weasis** viewer

### 📝 Reporting System
- Radiologists write structured reports
- AI-assisted optional pre-analysis
- Rich-text report editor with templates
- PDF report export and hospital notifications

### 🔔 Notifications & Real-time Updates
- WebSocket-based real-time case updates
- Email & SMS notifications for case status

### 🔐 Security & Compliance
- End-to-end encryption (TLS) 
- HIPAA/GDPR-ready architecture(in future)
- Audit logs and access monitoring
- Role-based permissions

