const User = require('../models/User');
const Job = require('../models/Job');
const axios = require('axios');

exports.getJobRecommendations = async (req, res) => {
  try {
    // Get user profile
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get all jobs
    const jobs = await Job.find();

    // Create prompt for Gemini
    const prompt = `
      I have a job seeker with the following profile:
      - Name: ${user.name}
      - Location: ${user.location}
      - Years of Experience: ${user.yearsOfExperience}
      - Skills: ${user.skills.join(', ')}
      - Preferred Job Type: ${user.preferredJobType}

      Here are the available jobs:
      ${jobs.map((job, index) => `
        Job ${index + 1}:
        - Title: ${job.title}
        - Company: ${job.company}
        - Location: ${job.location}
        - Job Type: ${job.jobType}
        - Experience Level: ${job.experienceLevel}
        - Skills Required: ${job.skills.join(', ')}
        - Description: ${job.description.substring(0, 100)}...
      `).join('\n')}

      Based on the job seeker's profile, please recommend the top 3 most suitable jobs from the list above.
      For each recommendation, provide the job number and a brief explanation of why it's a good match.
      Format your response as a JSON array with objects containing jobId, title, company, and reason fields.
    `;

    // Call Gemini API directly using axios
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      console.log("Using API Key:", apiKey ? "API key is set" : "API key is missing");

      // First, let's try to list available models
      try {
        const modelsResponse = await axios.get(
          'https://generativelanguage.googleapis.com/v1beta/models',
          {
            headers: {
              'x-goog-api-key': apiKey
            }
          }
        );
        console.log("Available models:", modelsResponse.data.models.map(model => model.name).join(', '));
      } catch (modelError) {
        console.log("Could not list models:", modelError.message);
      }

      // Use the URL format with API key as a query parameter (which is confirmed to work)
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      console.log("Using API URL format with query parameter");

      const response = await axios.post(
        apiUrl,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Extract the response text
      console.log("Response received from model");
      const content = response.data.candidates[0].content.parts[0].text;
      console.log("Gemini API Response:", content.substring(0, 100) + "...");

      // Parse the response - handle markdown code blocks if present
      let recommendations;
      try {
        // Check if the response is wrapped in markdown code blocks
        let jsonContent = content;
        if (content.includes('```json')) {
          // Extract the JSON content from the markdown code block
          const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonContent = jsonMatch[1].trim();
            console.log("Extracted JSON from markdown:", jsonContent.substring(0, 100) + "...");
          }
        }

        recommendations = JSON.parse(jsonContent);
        console.log("Successfully parsed JSON response");
      } catch (error) {
        console.error('Error parsing Gemini response:', error);
        console.log('Raw response:', content);

        // Fallback to custom algorithm if parsing fails
        return useFallbackAlgorithm(user, jobs, res);
      }

      // Map recommendations to actual job objects
      const recommendedJobs = recommendations.map(rec => {
        const jobId = rec.jobId;
        const job = jobs.find((j, index) => index + 1 === parseInt(jobId) || j._id.toString() === jobId);

        if (job) {
          return {
            _id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            jobType: job.jobType,
            skills: job.skills,
            reason: rec.reason
          };
        }
        return null;
      }).filter(job => job !== null);

      res.json(recommendedJobs);
    } catch (error) {
      console.error('Error calling Gemini API:', error.message);

      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', JSON.stringify(error.response.data, null, 2));

        // If the error is related to the model not being found, try with a different model
        if (error.response.data && error.response.data.error &&
            error.response.data.error.message &&
            error.response.data.error.message.includes('models/')) {

          console.log('Trying with a different model name...');
          try {
            // Try with a different model using the URL format with API key as a query parameter
            const alternativeApiKey = process.env.GEMINI_API_KEY;
            const alternativeApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${alternativeApiKey}`;
            console.log("Using alternative API URL format with query parameter");

            const alternativeResponse = await axios.post(
              alternativeApiUrl,
              {
                contents: [
                  {
                    parts: [
                      {
                        text: prompt
                      }
                    ]
                  }
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 1000
                }
              },
              {
                headers: {
                  'Content-Type': 'application/json'
                }
              }
            );

            // Process the response
            const content = alternativeResponse.data.candidates[0].content.parts[0].text;
            console.log("Alternative Gemini API Response:", content.substring(0, 100) + "...");

            // Parse the response - handle markdown code blocks if present
            let recommendations;
            try {
              // Check if the response is wrapped in markdown code blocks
              let jsonContent = content;
              if (content.includes('```json')) {
                // Extract the JSON content from the markdown code block
                const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
                if (jsonMatch && jsonMatch[1]) {
                  jsonContent = jsonMatch[1].trim();
                  console.log("Extracted JSON from alternative response:", jsonContent.substring(0, 100) + "...");
                }
              }

              recommendations = JSON.parse(jsonContent);
              console.log("Successfully parsed alternative JSON response");

              // Map recommendations to actual job objects
              const recommendedJobs = recommendations.map(rec => {
                const jobId = rec.jobId;
                const job = jobs.find((j, index) => index + 1 === parseInt(jobId) || j._id.toString() === jobId);

                if (job) {
                  return {
                    _id: job._id,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    jobType: job.jobType,
                    skills: job.skills,
                    reason: rec.reason
                  };
                }
                return null;
              }).filter(job => job !== null);

              return res.json(recommendedJobs);
            } catch (parseError) {
              console.error('Error parsing alternative Gemini response:', parseError);
            }
          } catch (alternativeError) {
            console.error('Error with alternative model:', alternativeError.message);

            // Try with a third model option
            try {
              console.log("Trying with a third model option...");
              const thirdApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`;

              const thirdResponse = await axios.post(
                thirdApiUrl,
                {
                  contents: [
                    {
                      parts: [
                        {
                          text: prompt
                        }
                      ]
                    }
                  ],
                  generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1000
                  }
                },
                {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              );

              // Process the response
              const thirdContent = thirdResponse.data.candidates[0].content.parts[0].text;
              console.log("Third model API Response:", thirdContent.substring(0, 100) + "...");

              // Parse the response
              let thirdRecommendations;
              try {
                // Check if the response is wrapped in markdown code blocks
                let jsonContent = thirdContent;
                if (thirdContent.includes('```json')) {
                  // Extract the JSON content from the markdown code block
                  const jsonMatch = thirdContent.match(/```json\s*([\s\S]*?)\s*```/);
                  if (jsonMatch && jsonMatch[1]) {
                    jsonContent = jsonMatch[1].trim();
                    console.log("Extracted JSON from third model response:", jsonContent.substring(0, 100) + "...");
                  }
                }

                thirdRecommendations = JSON.parse(jsonContent);
                console.log("Successfully parsed third model JSON response");

                // Map recommendations to actual job objects
                const recommendedJobs = thirdRecommendations.map(rec => {
                  const jobId = rec.jobId;
                  const job = jobs.find((j, index) => index + 1 === parseInt(jobId) || j._id.toString() === jobId);

                  if (job) {
                    return {
                      _id: job._id,
                      title: job.title,
                      company: job.company,
                      location: job.location,
                      jobType: job.jobType,
                      skills: job.skills,
                      reason: rec.reason
                    };
                  }
                  return null;
                }).filter(job => job !== null);

                return res.json(recommendedJobs);
              } catch (parseError) {
                console.error('Error parsing third model response:', parseError);
              }
            } catch (thirdError) {
              console.error('Error with third model option:', thirdError.message);
            }
          }
        }
      } else {
        console.log('Error details:', 'No response data');
      }

      // Fallback to custom algorithm if API call fails
      return useFallbackAlgorithm(user, jobs, res);
    }
  } catch (err) {
    console.error('Recommendation error:', err.message);
    res.status(500).send('Server error');
  }
};

// Fallback algorithm if Gemini API fails
async function useFallbackAlgorithm(user, jobs, res) {
  console.log("Using fallback algorithm for job recommendations");

  // Simple matching algorithm based on skills and job type
  const matchedJobs = jobs.map(job => {
    // Calculate skill match percentage
    const userSkills = user.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());

    const matchingSkills = jobSkills.filter(skill =>
      userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );

    const skillMatchScore = matchingSkills.length / jobSkills.length;

    // Job type match
    const jobTypeMatch =
      (user.preferredJobType === 'any') ||
      (user.preferredJobType === job.jobType) ? 1 : 0.5;

    // Experience level match
    let expMatch = 1;
    if (job.experienceLevel === 'senior' && user.yearsOfExperience < 5) {
      expMatch = 0.5;
    } else if (job.experienceLevel === 'mid' && user.yearsOfExperience < 2) {
      expMatch = 0.7;
    }

    // Calculate total match score
    const matchScore = (skillMatchScore * 0.6) + (jobTypeMatch * 0.2) + (expMatch * 0.2);

    return {
      job,
      matchScore,
      skillMatchScore,
      jobTypeMatch,
      expMatch
    };
  });

  // Sort by match score and take top 3
  const topMatches = matchedJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  // Format the response
  const recommendedJobs = topMatches.map(match => {
    const job = match.job;

    // Generate reason based on match factors
    let reason = `This job matches ${Math.round(match.skillMatchScore * 100)}% of your skills. `;

    if (match.jobTypeMatch === 1) {
      reason += `The ${job.jobType} work arrangement aligns with your preference. `;
    }

    if (match.expMatch === 1) {
      reason += `Your ${user.yearsOfExperience} years of experience is a good fit for this ${job.experienceLevel} level position.`;
    } else {
      reason += `While your experience level is slightly below the ideal for this position, your skills make you a good candidate.`;
    }

    return {
      _id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      jobType: job.jobType,
      skills: job.skills,
      reason: reason
    };
  });

  return res.json(recommendedJobs);
}
