# Connect Vibes Server

This is social media feed application build using the MERN stack (MongoDB, Express, React, Node.js). The application should allow users to post updates, view updates from others, and like or comment on posts. The focus should be on building a real-time, interactive feed.

# Pre-requisites

Install Node.js version 20.17.0

# Getting started

- Clone the repository
  git clone https://github.com/GlobalTech4u/connect-vibes-server.git

- Navigate to folder
  Example - cd connect-vibes-server

- Install all dependencies
  npm install

- Create .env.local file
  Copy the .env.sample (Path to .env.sample file - node-runtime\samples\.env.sample) file and paste in environments folder (Path to create file - node-runtime\environments\.env.local)
  Now rename the .env.sample file to .env.local

- Contents of .env file
  PORT=8080
  MONGO_DB_URL=mongodb
  JWT_SECRET=secret-jwt
  JWT_REFRESH_SECRET=jwt-refresh-secret
  CLOUDINARY_CLOUD_NAME=cloudinary-cloud-name
  CLOUDINARY_API_KEY=cloudinary-api-key
  CLOUDINARY_API_SECRET=cloudinary-api-secret
  CLIENT_APP_URL=http://test.com/
  SERVER_APP_URL=http://localhost:8080

- Run Connect Vibes Server locally
  npm run start

# Swagger Documentation

Accessing Swagger Documentation
To view the Swagger documentation for the Connect Vibes Server application:

1.  Run the Server: Ensure the server is running.
2.  Visit the Documentation: Open your browser and navigate to http://localhost:8080/api-docs/.

Authorizing with Swagger
To authorize and access protected endpoints:

1.  Run the Swagger UI App: Ensure the Swagger UI is running.
2.  Open Local Storage: In your browser's developer tools, navigate to the local storage.
3.  Locate the User Token: Find the user object and copy the value of the token.
4.  Authorize: Click the "Authorize" button in the Swagger UI and paste the token string

# Node.js logger

Used pino for logging info and errors

# Testing

The tests are written in Mocha and the assertions done using Chai

"chai": "^5.1.2",
"chai-http": "^5.1.1",
"mocha": "^10.8.1",

- Running tests using NPM Scripts
  npm run test
