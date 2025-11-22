# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# From the root directory
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Step 2: Set Up Environment Variables

#### Backend (.env file in `/backend` directory)

Create a file named `.env` in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume_builder
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
OPENAI_API_KEY=your_openai_api_key
```

**Note:** 
- For MongoDB, you can use MongoDB Atlas (cloud) or local MongoDB
- Get OpenAI API key from: https://platform.openai.com/

#### Frontend (.env.local file in `/frontend` directory)

Create a file named `.env.local` in the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `MONGODB_URI` in backend `.env` file

### Step 4: Run the Application

**Option 1: Run Both Services Together (Recommended)**

From the root directory:
```bash
npm run dev
```

**Option 2: Run Services Separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 First Steps

1. **Sign Up**: Create a new account at http://localhost:3000/signup
2. **Create Resume**: Click "Create New Resume" on the dashboard
3. **Fill Information**: Add your personal info, experience, education, etc.
4. **Save Resume**: Click "Save Resume" to store your progress
5. **Check Resume**: Use the AI checker to get feedback
6. **Export PDF**: Download your resume as a PDF

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` in backend `.env` is correct

### OpenAI API Errors
- Verify your API key is correct
- Check your OpenAI account has credits
- The app will work without OpenAI (with default responses)

### PDF Export Issues
- On Linux, install Chromium: `sudo apt-get install -y chromium-browser`
- On macOS, Puppeteer should work out of the box

### Port Already in Use
- Change `PORT` in backend `.env` if 5000 is taken
- Update `NEXT_PUBLIC_API_URL` in frontend `.env.local` accordingly

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Customize the resume templates
- Add more AI features

## 🎯 Features Overview

✅ User Authentication (JWT)
✅ Resume Editor (Form-based)
✅ AI Resume Checker
✅ AI Resume Generator
✅ PDF Export
✅ Dashboard for managing resumes

Enjoy building your resume! 🚀

