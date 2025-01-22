# FitKnight_IMG

A platform designed for health-conscious individuals to connect, share posts, and find workout buddies or create groups.

# Features
User Authentication: Users can register, log in, and fill out details like name, address, and user type (Workout Buddy Finder or Group Creator).

Public Posts: Users can create and share posts publicly and view posts from other users on the home page.

Friend Requests: Users can send and receive friend requests. Once accepted, they become friends, visible on the frontend.

Group Creation: Group creators can create multiple groups, and users can join these groups.

Profile Picture: Users can upload a profile picture, stored on Cloudinary.

Note: Due to time constraints, chat functionality has not been implemented yet.

## Tech Stack
Frontend:
React.js
UserContext to store user data globally

## Backend:
Node.js with Express.js (RESTful API)
MongoDB (Database)

## Authentication:
JWT (JSON Web Tokens) for user authentication via cookies
bcrypt for password encryption

## Third-party Services:
Cloudinary for storing user profile pictures




# Installation
Clone the repository:  

git clone https://github.com/hariom57/FitKnight_IMG  

Navigate to both the frontend and backend directories and install dependencies:  

cd frontend    
npm install  
cd ../backend  
npm install  
Start the frontend and backend:  
  
For the frontend:  
cd frontend  
npm start  
For the backend:  
cd backend  
node index.js    
