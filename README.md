# AI-Powered Job Match Platform

A full-stack application that uses AI to recommend job matches based on user profiles.

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
