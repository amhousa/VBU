### VBU (Vercel Blob Upload)





A modern, elegant file upload center built with Next.js and Vercel Blob storage. VBU provides a seamless interface for uploading, managing, and sharing files through Vercel's Blob storage service.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)



- [Usage](#usage)

- [Uploading Files](#uploading-files)
- [Managing Files](#managing-files)
- [Using File URLs](#using-file-urls)



- [API Documentation](#api-documentation)

- [Upload API](#upload-api)
- [List API](#list-api)
- [Delete API](#delete-api)



- [Customization](#customization)

- [Theming](#theming)
- [Icons](#icons)



- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## 🔍 Overview

VBU (Vercel Blob Upload) is a full-featured file upload center that leverages Vercel Blob storage for reliable and scalable file hosting. The application provides an intuitive interface for uploading files, viewing uploaded files, and generating code snippets for embedding files in various formats.

The project features a modern, responsive UI with a dark Nord theme, custom icons, and a clean, user-friendly interface.

## ✨ Features

- **Drag-and-drop file uploads** with progress tracking
- **File management** with easy deletion
- **Copy URL functionality** for quick sharing
- **Code snippet generation** for HTML, Markdown, and Next.js
- **Responsive design** that works on mobile and desktop
- **Dark theme** with Nord color palette
- **Custom iconography** throughout the interface
- **Toast notifications** for user feedback
- **Help documentation** for user guidance


## 🛠️ Technologies

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Storage**: Vercel Blob
- **Fonts**: Google Fonts (Inter, Permanent Marker)
- **Icons**: Custom SVG icons
- **Deployment**: Vercel


## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Vercel account with Blob storage enabled
- Vercel CLI (optional, for local development)


### Installation

1. Clone the repository:


```shellscript
git clone https://github.com/amhousa/VBU.git
cd VBU
```

2. Install dependencies:


```shellscript
npm install
# or
yarn install
```

3. Set up environment variables (see next section)
4. Run the development server:


```shellscript
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```plaintext
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

You can obtain a Blob token from the Vercel dashboard under Project Settings > Storage.

## 📝 Usage

### Uploading Files

1. Navigate to the main page of the application
2. Drag and drop a file into the upload area, or click "Browse Files" to select a file
3. Once a file is selected, click "Upload File" to start the upload process
4. A progress bar will show the upload status
5. Upon successful upload, you'll receive a confirmation notification


### Managing Files

1. All uploaded files appear in the "Your Files" section
2. For each file, you can:

1. Copy the file URL to clipboard
2. Open/download the file
3. Delete the file





### Using File URLs

When you upload a file, the "Usage Examples" section will appear with code snippets for:

- HTML: `<img>` tag for embedding images
- Markdown: Image syntax for markdown documents
- Next.js: `Image` component implementation


## 🔌 API Documentation

VBU exposes several API endpoints for file operations:

### Upload API

**Endpoint**: `/api/upload`

**Method**: POST

**Query Parameters**:

- `filename`: Name of the file to be uploaded


**Request Body**: File content as binary data

**Response**:

```json
{
  "url": "https://vercel-blob.com/...",
  "pathname": "...",
  "contentType": "image/jpeg",
  "size": 12345
}
```

### List API

**Endpoint**: `/api/list`

**Method**: GET

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
      "uploadedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

### Delete API

**Endpoint**: `/api/delete`

**Method**: DELETE

**Query Parameters**:

- `url`: URL of the file to delete


**Response**:

```json
{
  "success": true
}
```

## 🎨 Customization

### Theming

The application uses a custom Nord theme with Tailwind CSS. You can modify the theme by editing:

- `tailwind.config.ts`: Contains theme colors and extensions
- `app/globals.css`: Contains CSS variables and global styles


### Icons

All icons are custom SVG components located in the `components/` directory. You can replace these with your own SVG icons by editing the respective component files.

## 📁 Project Structure

```plaintext
VBU/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   ├── delete/       # Delete file API
│   │   ├── list/         # List files API
│   │   └── upload/       # Upload file API
│   ├── favicon.svg       # Favicon
│   ├── globals.css       # Global styles
│   ├── icon.tsx          # App icon
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   ├── *-icon.tsx        # Custom icon components
│   ├── code-terminal.tsx # Code snippet display
│   ├── copy-button.tsx   # Copy to clipboard button
│   ├── file-list.tsx     # File listing component
│   ├── file-upload.tsx   # File upload component
│   ├── header.tsx        # App header
│   └── help-popup.tsx    # Help documentation popup
├── lib/                  # Utility functions
├── public/               # Static assets
│   └── images/           # Image assets
├── .env.local            # Environment variables (create this)
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

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