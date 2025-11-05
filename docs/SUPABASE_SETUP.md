# Storage Setup (Supabase)

This project uses Supabase **only for storage functionality** alongside the existing NextAuth.js + Prisma + PostgreSQL setup.

## 🚀 Quick Start

### 1. Start Docker Desktop
Make sure Docker Desktop is running on your system.

### 2. Start Storage Services
```bash
npm run storage:start
```

### 3. Access Storage Studio (Optional)
Open [http://127.0.0.1:54323](http://127.0.0.1:54323) to access the local Supabase Studio for storage management.

### 4. Test File Upload
Visit [http://localhost:3000/dev/storage](http://localhost:3000/dev/storage) to test the file upload functionality.

## 📁 Storage Buckets Configured

- **uploads** - General file uploads (50MB max)
- **avatars** - User profile pictures (5MB max, images only)
- **documents** - PDF and document files (100MB max)

## 🛠️ Available Scripts

```bash
# Storage Commands
npm run storage:start             # Start local storage services
npm run storage:stop              # Stop local storage services  
npm run storage:status            # Check service status
npm run storage:generate-types    # Generate TypeScript types
```

## 🔧 Environment Variables


## 📂 File Structure

```
src/
├── lib/
│   └── supabase.ts           # Storage client configuration
├── components/
│   └── file-upload.tsx       # Reusable file upload component
├── app/
│   ├── api/
│   │   └── storage/
│   │       ├── route.ts      # Upload, list, delete files
│   │       └── [bucket]/[...path]/
│   │           └── route.ts  # Serve files
│   └── (dev)/
│       └── dev/storage/
│           └── page.tsx      # Demo page for testing uploads
└── supabase/
    ├── config.toml          # Storage-only configuration
    └── storage/             # Local storage directories
        ├── uploads/
        ├── avatars/
        └── documents/
```

## 🔄 Integration Strategy

This setup follows a **storage-only approach**:

- ✅ **Keep existing**: Prisma ORM, NextAuth.js, PostgreSQL database for auth/data
- ✅ **Use Supabase for**: File storage only (S3-compatible)
- ✅ **Local development**: Storage services with Docker containers
- ✅ **Clean separation**: Database and storage are independent

## 🧪 Testing the Setup

1. **Start the development environment**:
   ```bash
   npm run storage:start
   npm run dev
   ```

2. **Visit the demo page**: [http://localhost:3000/dev/storage](http://localhost:3000/dev/storage)

3. **Try uploading files** to different buckets and verify they appear in Storage Studio

## 📈 Next Steps

- [ ] Integrate file uploads into existing user profiles
- [ ] Add file management UI (list, delete, organize)
- [ ] Implement image resizing/optimization
- [ ] Deploy to production Supabase instance for storage

## 🔗 Useful Links

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Local Storage Studio](http://127.0.0.1:54323)