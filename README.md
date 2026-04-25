### VBU (Vercel Blob Upload)

A modern, elegant file upload center built with Next.js and Vercel Blob storage with email-based authentication. VBU provides a seamless interface for uploading, managing, and sharing files with automatic public/private access control based on user authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Authentication](#authentication)
  - [Uploading Files](#uploading-files)
  - [Managing Files](#managing-files)
  - [Using File URLs](#using-file-urls)
- [API Documentation](#api-documentation)
  - [Authentication APIs](#authentication-apis)
  - [Upload API](#upload-api)
  - [List API](#list-api)
  - [Delete API](#delete-api)
- [Architecture](#architecture)
- [Customization](#customization)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🔍 Overview

VBU (Vercel Blob Upload) is a full-featured file upload center that leverages Vercel Blob storage for reliable and scalable file hosting. The application provides an intuitive interface for uploading files, viewing uploaded files, and generating code snippets for embedding files in various formats.

Key innovations:
- **Email-based authentication** using Resend API for secure user verification
- **Intelligent storage access** - automatic public/private file access based on authentication status
- **Session management** - secure token-based sessions with 30-day expiration
- **Modern responsive UI** with dark Nord theme and custom icons

## ✨ Features

- **Email-based Authentication**
  - Send verification codes via email using Resend API
  - Beautiful, professional email templates
  - 10-minute code expiration
  - Secure token-based sessions

- **Intelligent File Storage**
  - **Public files** for guest users (accessible to everyone)
  - **Private files** for authenticated users (only accessible by owner)
  - Automatic access level assignment
  - User-organized file namespaces

- **File Management**
  - Drag-and-drop file uploads with progress tracking
  - File listing with filtering based on access level
  - Easy deletion with ownership verification
  - Copy URL functionality for quick sharing

- **Code Generation**
  - Generate code snippets for HTML, Markdown, and Next.js
  - Easy embedding in various formats

- **User Experience**
  - Responsive design for mobile and desktop
  - Dark theme with Nord color palette
  - Toast notifications for user feedback
  - Help documentation
  - Multiple view modes (grid, list, compact)

- **Security**
  - Virus scanning on uploaded files
  - Private file access control
  - Secure token validation

## 🛠️ Technologies

- **Frontend**: Next.js 16.1.6, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Storage**: Vercel Blob
- **Email**: Resend API
- **Authentication**: Email-based OTP with session tokens
- **Fonts**: Google Fonts (Inter, Permanent Marker)
- **Icons**: Custom SVG icons + Lucide React
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm/yarn
- Vercel account with Blob storage enabled
- Resend account with API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/amhousa/VBU.git
cd VBU
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up environment variables (see next section)

4. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```plaintext
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
```

#### Obtaining Credentials:

- **BLOB_READ_WRITE_TOKEN**: Get from [Vercel Dashboard](https://vercel.com) → Project Settings → Storage → Blob
- **RESEND_API_KEY**: Get from [Resend Dashboard](https://resend.com) → API Keys

## 📝 Usage

### Authentication

1. Click the "Login" button in the top-right corner
2. Enter your email address
3. Check your email for the verification code
4. Enter the 6-digit code in the app
5. You're now authenticated! Your session lasts for 30 days

**Logging out**: Click on your email in the header → Select "Logout"

### Uploading Files

#### As a Guest (Unauthenticated):
1. Drag and drop a file or click "Browse Files"
2. Click "Upload File"
3. Your file is uploaded as **public** (visible to everyone)
4. You receive a public URL

#### As a Logged-in User:
1. Login with your email
2. Drag and drop a file or click "Browse Files"
3. Click "Upload File"
4. Your file is uploaded as **private** (only visible to you)
5. Files are organized in your personal namespace

### Managing Files

1. **View Files**: The "Your Files" section shows:
   - Public files (if guest) or Public + your Private files (if authenticated)
   - File thumbnails and metadata

2. **Copy URL**: Click the copy icon to copy file URL to clipboard

3. **Download**: Click the download icon to open/download file

4. **Delete**: Click the delete icon
   - Private files: Only you can delete
   - Public files: Available to guests or public

### Using File URLs

When you upload a file, the "Usage Examples" section appears with code snippets:

- **HTML**: `<img>` tag for embedding images
- **Markdown**: Image syntax for markdown documents
- **Next.js**: `Image` component implementation

## 🔌 API Documentation

### Authentication APIs

#### Send OTP Email

**Endpoint**: `/api/auth/send-otp`

**Method**: POST

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true
}
```

#### Verify OTP Code

**Endpoint**: `/api/auth/verify-otp`

**Method**: POST

**Request Body**:
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response**:
```json
{
  "success": true,
  "token": "secure_token_here",
  "email": "user@example.com"
}
```

### Upload API

**Endpoint**: `/api/upload`

**Method**: POST

**Query Parameters**:
- `filename` (required): Name of the file to upload
- `token` (optional): Authentication token for private uploads

**Headers**:
- `x-vbu-token` (optional): Authentication token

**Request Body**: File content as binary data

**Response**:
```json
{
  "url": "https://vercel-blob.com/...",
  "pathname": "...",
  "contentType": "image/jpeg",
  "size": 12345,
  "access": "private"
}
```

### List API

**Endpoint**: `/api/list`

**Method**: GET

**Query Parameters**:
- `token` (optional): Authentication token to see private files

**Headers**:
- `x-vbu-token` (optional): Authentication token

**Response**:
```json
{
  "files": [
    {
      "url": "https://vercel-blob.com/...",
      "pathname": "...",
      "filename": "example.jpg",
      "contentType": "image/jpeg",
      "size": 12345,
      "uploadedAt": "2024-01-01T00:00:00.000Z",
      "category": "images",
      "access": "private"
    }
  ]
}
```

### Delete API

**Endpoint**: `/api/delete`

**Method**: DELETE

**Query Parameters**:
- `url` (required): URL of the file to delete
- `token` (optional): Authentication token for private files

**Headers**:
- `x-vbu-token` (optional): Authentication token

**Response**:
```json
{
  "success": true
}
```

**Error Responses**:
```json
{
  "error": "Unauthorized: You can only delete your own files"
}
```

## 🏗️ Architecture

### Authentication Flow

```
User → Email Input → Send OTP Email → Verify Code → Generate Session Token → Store in localStorage
```

### File Access Control

```
Guest User → Upload → Public Blob → Public URL
Authenticated User → Upload → Private Blob → User-scoped URL
```

### File Listing

```
Request with Token → Validate Token → Filter Files → Return Public + User's Private Files
Request without Token → Return Only Public Files
```

## 🎨 Customization

### Theming

The application uses a custom Nord theme with Tailwind CSS. Modify:

- `tailwind.config.ts`: Theme colors and extensions
- `app/globals.css`: CSS variables and global styles
- `components/theme-provider.tsx`: Theme configuration

### Email Template

Edit the email template in:
- `lib/email.ts`: HTML template for verification emails

Customize:
- Colors and branding
- Company name and logo
- Email footer

### Icons

Custom SVG components located in `components/` can be replaced:
- Replace in component files
- Or use Lucide React icons throughout

## 📁 Project Structure

```plaintext
VBU/
├── app/                           # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-otp/         # Send verification email
│   │   │   └── verify-otp/       # Verify code and create session
│   │   ├── delete/               # Delete file (with auth)
│   │   ├── download/             # Download file
│   │   ├── list/                 # List files (with auth filtering)
│   │   ├── share/                # Share API (deprecated)
│   │   └── upload/               # Upload file (with auth)
│   ├── favicon.svg
│   ├── globals.css
│   ├── icon.tsx
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── *-icon.tsx                 # Custom SVG icons
│   ├── code-terminal.tsx          # Code snippet display
│   ├── copy-button.tsx            # Copy to clipboard
│   ├── file-list.tsx              # File listing with auth
│   ├── file-upload.tsx            # Upload component
│   ├── header.tsx                 # App header with auth status
│   ├── help-popup.tsx             # Help documentation
│   ├── login-popup.tsx            # Login/logout UI
│   ├── login-screen.tsx           # Email auth screen
│   ├── theme-provider.tsx         # Theme setup
│   └── skeletons.tsx              # Loading skeletons
│
├── lib/
│   ├── auth.ts                    # Token validation & auth helpers
│   ├── email.ts                   # Resend email service
│   ├── file-store.ts              # File metadata storage
│   ├── sms.ts                     # SMS service (deprecated)
│   ├── utils.ts                   # Utility functions
│   └── virus-scan.ts              # ClamAV virus scanning
│
├── data/
│   ├── files.json                 # File metadata store
│   ├── otps.json                  # OTP storage
│   └── sessions.json              # Session tokens
│
├── public/                        # Static assets
│   └── images/
│
├── .env.local                     # Environment variables (create this)
├── .env.example                   # Environment template
├── next.config.mjs
├── package.json
├── pnpm-workspace.yaml
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🔐 Security Considerations

- **File Access**: Private files are only accessible to authenticated owners
- **Token Security**: Tokens are generated using crypto.randomBytes and stored securely
- **Email Verification**: OTP codes expire after 10 minutes
- **Session Management**: Tokens expire after 30 days
- **Virus Scanning**: Uploaded files are scanned using ClamAV
- **CORS**: Blob URLs are served directly from Vercel

## 📦 Dependencies

See `package.json` for complete list. Key packages:
- `next`: ^16.1.6
- `react`: ^19.2.4
- `@vercel/blob`: Latest
- `resend`: ^3.0.0
- `tailwindcss`: ^3.4.19
- `typescript`: ^5.9.3

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

Amirhossin Salmani - [amirsalmani.com](https://amirsalmani.com)

Project Link: [https://github.com/amhousa/VBU](https://github.com/amhousa/VBU)

---

Built with ❤️ by `<a href="https://github.com/amhousa">`amhousa`</a>`