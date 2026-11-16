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
* Run the Angular host and claims remote independently with Webpack Module Federation.

## Technologies Used

### Frontend

* Angular
* TypeScript
* Nx
* Webpack Module Federation
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
│   ├── claimlite/        # Host shell and User Directory (port 4200)
│   ├── claims/            # Claims remote (port 4201)
│   └── shared/users/      # Policyholder API service used by both apps
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

Start the host and claims remote together:

```bash
npm run start:all
```

Open `http://localhost:4200`. To run only one frontend application, use `npm run start:host` or `npm run start:claims`. The claims remote is also available on its own at `http://localhost:4201/claims`.

Build the applications independently with `npm run build:host` and `npm run build:claims`. The host's runtime remote URL is set in `frontend/claimlite/public/mf.manifest.json`; change it for deployment and configure the remote server to allow cross-origin requests for its federation entry and chunks.

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
