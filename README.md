# Resume Builder & Checker - Full Stack Application

A comprehensive full-stack web application for creating, checking, and managing resumes with AI-powered feedback and PDF export capabilities.

## 🚀 Features

- **User Authentication** - Secure login/signup with JWT
- **Resume Editor** - Form-based resume builder with multiple sections
- **AI Resume Checker** - Get AI-powered feedback with scores and suggestions
- **AI Resume Generator** - Enhance your resume with AI
- **PDF Export** - Download your resume as a beautifully formatted PDF
- **Dashboard** - Manage all your resumes in one place

## 📁 Project Structure

```
Resume_Builder/
├── frontend/          # Next.js 14 application
│   ├── app/          # Next.js app directory
│   ├── lib/          # Utility functions
│   └── package.json
├── backend/          # Express.js API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── services/     # Business logic (AI, PDF)
│   ├── middleware/   # Auth middleware
│   └── package.json
└── package.json      # Monorepo root
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Hot Toast** - Notifications

### Backend
- **Express.js** - Node.js framework
- **MongoDB** - Database with Mongoose
- **JWT** - Authentication
- **OpenAI API** - AI-powered resume checking and generation
- **Puppeteer** - PDF generation

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Step 1: Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume_builder
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=your_openai_api_key
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
cd frontend
```

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env
```

## 🚀 Running the Application

### Option 1: Run Both Services Separately

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Option 2: Run Both Services Together (Monorepo)

From the root directory:

```bash
# Install concurrently if not already installed
npm install

# Run both services
npm run dev
```

This will start both backend and frontend simultaneously.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Resumes
- `GET /api/resumes` - Get all user resumes
- `GET /api/resumes/:id` - Get single resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/check` - AI resume checker
- `POST /api/resumes/:id/generate` - AI resume generator
- `GET /api/resumes/:id/export` - Export resume as PDF

## 🎯 Usage Guide

1. **Sign Up / Login**: Create an account or login to existing account
2. **Create Resume**: Click "Create New Resume" to start building
3. **Fill Sections**: Add personal info, experience, education, skills, projects, and certifications
4. **Save Resume**: Click "Save Resume" to store your progress
5. **Check Resume**: Use AI checker to get feedback and suggestions
6. **Generate with AI**: Let AI enhance your resume content
7. **Export PDF**: Download your resume as a PDF

## 🔧 Configuration

### OpenAI Setup
1. Get your API key from [OpenAI](https://platform.openai.com/)
2. Add it to `backend/.env` as `OPENAI_API_KEY`

### MongoDB Setup
- **Local**: Install MongoDB and run `mongod`
- **Cloud**: Use MongoDB Atlas and update `MONGODB_URI` in `.env`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `MONGODB_URI` in `.env`

2. **OpenAI API Errors**
   - Verify your API key is correct
   - Check your OpenAI account has credits

3. **PDF Generation Fails**
   - Ensure Puppeteer dependencies are installed
   - On Linux, may need: `sudo apt-get install -y chromium-browser`

4. **CORS Errors**
   - Ensure backend CORS is configured correctly
   - Check `NEXT_PUBLIC_API_URL` matches backend URL



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

