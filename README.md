# claimeLite
# ClaimLite – Claims Management System

## About the Project

ClaimLite is a full-stack web application developed to manage policyholders and insurance claims. It allows users to register policyholders, create insurance claims, and view the available records through a user-friendly interface.

## Features

* Add and manage policyholders.
* Store policyholder details such as name, email, and phone number.
* Create and manage insurance claims.
* Support different claim types: Auto, Home, and Health.
* Validate user and claim form inputs.
* Analyze claim descriptions with Gemini to suggest a claim type and AI risk score.
* Store application data in MongoDB.
* Navigate between user and claim pages using Angular routing.

## Technologies Used

### Frontend

* Angular
* TypeScript
* Nx
* Duet Design System

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Tools

* Git and GitHub
* Postman

## Project Structure

```text
ClaimLite/
├── backend/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   └── claimlite/
│       └── src/
│           └── app/
│               ├── users/
│               ├── claims/
│               ├── app.ts
│               └── app.routes.ts
└── README.md
```

## Prerequisites

Install the following before running the project:

* Node.js and npm
* MongoDB
* Git

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/malavikavijay-coder/claimeLite.git
cd claimeLite
```

### 2. Start the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Configure the backend environment in `backend/.env` with your MongoDB connection and Gemini API key. Use `backend/.env.example` as a template. Keep the real API key private; it is only used by the backend.

Then start the server:

```bash
node server.js
```

### 3. Start the Frontend

Open a new terminal in the `frontend` directory and run:

```bash
cd frontend
npm install
```

Start the Angular development server using the project's configured Nx or Angular command.

For example, if the project's `project.json` defines the `serve` target:

```bash
npm start
```

Open the local URL displayed in the terminal to access the application.

## Usage

1. Open the ClaimLite application in your browser.
2. Navigate to the Users section to register policyholders.
3. View the registered policyholders.
4. Navigate to the Claims section to create and view insurance claims.
5. Enter a claim description and select **Analyze Claim** to get a suggested claim type and risk score. Review the suggestion, then complete and save the claim.

## Future Enhancements

* User authentication and authorization.
* Search, filter, and pagination.
* Claim status tracking.
* Improved reporting and dashboard features.

## Author

Malavika V

## License

This project is developed for learning and demonstration purposes.
