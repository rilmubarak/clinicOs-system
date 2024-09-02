# ClinicOs System

## Instructions to Run ClinicOs App Locally

To run this project locally on your machine, follow these steps:

### Prerequisites

1. **Setup Environment**

  - Ensure you copy the values from `.env.example` to a new `.env` file before starting the development server.

2. **Install Dependencies**

  ```
  npm install
  ```

3. **Start the Development Server**

  - Run the following command to start the app development server:
    ```
    npm run dev
    ```
  - This should launch the application in your default web browser. If it doesn't, you can manually navigate to `http://localhost:3000`

4. **Start the Backend Server**

  - Run the following command to start the backend server:
    ```
    npm run start:server
    ```
  - The backend server will be available at `http://localhost:5001`. 

5. **Accessing the Application**

  - Once the development server is running, you can access the application through your web browser at the address indicated in your terminal.

---

# Additional Notes

- Node.js (recommended min: v.16)

- API Endpoint: Since the specific endpoint wasn't provided, I utilized a fake JSON-server to simulate the backend. This allowed me to test the functionality effectively.

- Date Time Questions: Without example data for date-time questions, I implemented a basic date-time input with randomly generated values to ensure functionality.

- Testing Requirement: Due to time limitations, I wasn’t able to implement the testing requirement.