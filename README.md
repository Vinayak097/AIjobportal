# AI-Powered Job Match Platform

A full-stack application that uses AI to recommend job matches based on user profiles.

## Live Demo

- **Frontend**: [https://ai-job-portal.vercel.app](https://ai-job-portal.vercel.app)
- **Backend API**: [https://ai-job-recommender-api.onrender.com](https://ai-job-recommender-api.onrender.com)
- **GitHub Repository**: [https://github.com/Vinayak097/AIjobportal](https://github.com/Vinayak097/AIjobportal)

## Features

- **User Authentication**: Sign up, log in, and log out functionality with JWT
- **User Profile Management**: Create and update your profile with skills, experience, and preferences
- **Job Listings**: Browse available job opportunities
- **AI Job Recommendations**: Get personalized job recommendations based on your profile

## Tech Stack

### Frontend
- **Next.js**: React framework for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: Type-safe JavaScript

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for Node.js
- **MongoDB**: NoSQL database for storing user profiles and job listings
- **JWT**: JSON Web Tokens for authentication
- **Google Gemini API**: For AI-powered job recommendations using free tier models (with automatic fallback algorithm)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. Clone the repository
```
git clone <repository-url>
cd ai-job-recommender
```

2. Install dependencies for both frontend and backend
```
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Set up environment variables

   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

4. Seed the database with sample jobs
```
cd backend
node utils/seedJobs.js
```

5. Start the development servers

   In one terminal (for the backend):
   ```
   cd backend
   npm run dev
   ```

   In another terminal (for the frontend):
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## AI Job Recommendation Feature

The job recommendation feature works as follows:

1. When a user clicks the "Find My Matches" button, the frontend sends a request to the backend API.
2. The backend retrieves the user's profile data (skills, experience, location, etc.) and the list of available jobs.
3. The backend constructs a prompt for the Google Gemini API that includes:
   - The user's profile information
   - Details about all available jobs
   - Instructions to recommend the top 3 most suitable jobs based on the user's profile
4. The Gemini API analyzes the data and returns recommendations with explanations for why each job is a good match.
5. The backend processes the AI response and sends the recommendations back to the frontend.
6. The frontend displays the recommended jobs with explanations to the user.

### AI Prompt Design

The prompt sent to the Gemini API is carefully designed to generate high-quality job recommendations. Here's the prompt structure:

```
I have a job seeker with the following profile:
- Name: [user.name]
- Location: [user.location]
- Years of Experience: [user.yearsOfExperience]
- Skills: [user.skills.join(', ')]
- Preferred Job Type: [user.preferredJobType]

Here are the available jobs:
[jobs.map((job, index) => `
  Job ${index + 1}:
  - Title: ${job.title}
  - Company: ${job.company}
  - Location: ${job.location}
  - Job Type: ${job.jobType}
  - Experience Level: ${job.experienceLevel}
  - Skills Required: ${job.skills.join(', ')}
  - Description: ${job.description.substring(0, 100)}...
`).join('\n')]

Based on the job seeker's profile, please recommend the top 3 most suitable jobs from the list above.
For each recommendation, provide the job number and a brief explanation of why it's a good match.
Format your response as a JSON array with objects containing jobId, title, company, and reason fields.
```

This prompt is designed with several key considerations:

1. **Structured Data**: Presents user profile and job information in a clear, structured format
2. **Specific Instructions**: Explicitly asks for the top 3 jobs with explanations
3. **Response Format**: Requests a specific JSON format for easy parsing
4. **Contextual Matching**: Provides all necessary context for making relevant matches
5. **Concise Descriptions**: Truncates long descriptions to keep the prompt size manageable

### Fallback Mechanism

The system implements a robust approach to ensure reliable job recommendations:

1. **Primary Method**: First attempts to use the Gemini API with the model "gemini-2.0-flash" (free tier) using the direct URL query parameter approach
2. **Secondary Method**: If the first attempt fails, tries with an alternative model "gemini-1.5-flash"
3. **Tertiary Method**: If the second attempt fails, tries with a third model option "gemini-2.0-flash-lite"
4. **Fallback Algorithm**: If all API attempts fail, automatically switches to a custom matching algorithm that:
   - Calculates skill match percentage between user skills and job requirements
   - Evaluates job type compatibility with user preferences
   - Assesses experience level suitability
   - Combines these factors into a weighted match score

This multi-layered approach ensures that users always receive personalized job recommendations, even if there are temporary issues with the AI service or API changes.

The system also includes intelligent response parsing that can handle various formats returned by the Gemini API, including responses formatted as markdown code blocks.

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/register` | Register a new user | `{ name, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | Login a user | `{ email, password }` | `{ token, user }` |
| GET | `/api/auth/user` | Get current user | - | `{ user }` |

### User Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/users/me` | Get user profile | - | `{ user }` |
| PUT | `/api/users/me` | Update user profile | `{ name, location, skills, yearsOfExperience, preferredJobType }` | `{ user }` |

### Job Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/jobs` | Get all jobs | - | `[{ job }]` |
| GET | `/api/jobs/:id` | Get job by ID | - | `{ job }` |

### Recommendation Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/recommendations` | Get job recommendations | - | `[{ job, reason }]` |

## Deployment Instructions

### Frontend Deployment (Vercel)

1. Fork or clone the repository to your GitHub account
2. Sign up for a Vercel account at [vercel.com](https://vercel.com)
3. Click "New Project" and import your GitHub repository
4. Select the repository and configure as follows:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
5. Click "Deploy"

### Backend Deployment (Render)

1. Sign up for a Render account at [render.com](https://render.com)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: ai-job-recommender-api
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
5. Add the following environment variables:
   - PORT: 5000
   - MONGODB_URI: your MongoDB connection string
   - JWT_SECRET: your JWT secret
   - GEMINI_API_KEY: your Google Gemini API key
6. Click "Create Web Service"

## Code Architecture

### Frontend Architecture

The frontend is built with Next.js and follows a modern React architecture:

- **App Router**: Uses Next.js 13+ app router for routing
- **Authentication**: JWT-based authentication with token storage
- **API Integration**: Axios for API calls to the backend
- **UI Components**: Tailwind CSS for styling
- **State Management**: React hooks for local state management

### Backend Architecture

The backend follows a typical Express.js architecture:

- **MVC Pattern**: Models, Controllers, and Routes
- **Authentication**: JWT middleware for protected routes
- **Database**: MongoDB with Mongoose ODM
- **API Integration**: Axios for Gemini API calls
- **Error Handling**: Centralized error handling middleware

### AI Integration Architecture

The AI recommendation system uses a multi-layered approach:

1. **Prompt Engineering**: Carefully crafted prompts for the Gemini API
2. **Model Selection**: Dynamic model selection based on availability
3. **Response Parsing**: Intelligent parsing of various response formats
4. **Fallback Mechanism**: Custom algorithm as a reliable backup
