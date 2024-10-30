# SocialMediaFeeds (SMF) -

This is social media feed application build using the MERN stack (MongoDB, Express, React, Node.js). The application should allow users to post updates, view updates from others, and like or comment on posts. The focus should be on building a real-time, interactive feed.

## Steps to run node-runtime module from root directory

// Navigate to folder
Example - cd node-runtime

// Install all dependencies
npm install

// Create .env.local file
Copy the .env.sample (Path to .env.sample file - node-runtime\samples\.env.sample) file and paste in environments folder (Path to create file - node-runtime\environments\.env.local)
Now rename the .env.sample file to .env.local

// Run SMF locally
npm run start

## Steps to run react-app module from root directory

// Navigate to folder
Example - cd react-app

// Install all dependencies
npm install

// Create .env.local file
Copy the .env.sample (Path to .env.sample file - react-app\samples\.env.sample) file and paste in environments folder (Path to create file - react-app\environments\.env.local)
Now rename the .env.sample file to .env.local

// Run react-app locally
npm run start:local

// Build react-app locally
npm run build:local

## Swagger Documentation

Accessing Swagger Documentation
To view the Swagger documentation for the SocialMediaFeeds (SMF) application:

1.  Run the Server: Ensure the server is running.
2.  Visit the Documentation: Open your browser and navigate to http://localhost:8080/api-docs/.

Authorizing with Swagger
To authorize and access protected endpoints:

1.  Run the Swagger UI App: Ensure the Swagger UI is running.
2.  Open Local Storage: In your browser's developer tools, navigate to the local storage.
3.  Locate the User Token: Find the user object and copy the value of the token.
4.  Authorize: Click the "Authorize" button in the Swagger UI and paste the token string
