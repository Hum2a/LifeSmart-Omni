# Belinca - Financial Education Web Application

Belinca is a React-based financial education web application designed to help users learn about financial concepts through interactive quizzes and simulations. This project is a React implementation of the Lifesmart Vue.js application.

## Features

- **User Authentication**: Sign up and sign in functionality using Firebase Authentication
- **Financial Quiz**: Test your financial knowledge with interactive quizzes
- **Team-based Learning**: Create teams to compete in quizzes and simulations
- **Financial Simulation**: Simulate investment decisions and see their impact over time
- **Investment Calculator**: Calculate potential returns on investments with different parameters
- **Results Analysis**: View detailed results and financial advice based on simulation performance

## Technologies Used

- React.js
- React Router for navigation
- Firebase (Authentication, Firestore)
- CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/belinca.git
cd belinca
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/src`: Source code
  - `/components`: React components
    - `/screens`: Main screen components
      - `/quiz`: Quiz-related components
      - `/simulation`: Simulation-related components
    - `/widgets`: Reusable UI components
    - `/styles`: Shared styles
  - `/firebase`: Firebase configuration and utilities
  - `/assets`: Images and other static assets

## Usage

1. **Home Screen**: Sign up or sign in to access the application
2. **Quiz**: Test your financial knowledge with interactive quizzes
3. **Simulation**: Make investment decisions and see their impact over time
4. **Investment Calculator**: Calculate potential returns on investments

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Original Lifesmart project for inspiration
- Firebase for authentication and database services
