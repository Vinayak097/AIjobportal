const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://aijobportal.onrender.com/api'
    : 'http://localhost:5000/api'
};

export default config;
