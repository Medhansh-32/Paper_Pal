# PaperPal Application 🎓📁

Welcome to the **PaperPal** application! This project is designed to manage and interact with study material files, handle user responses, and assist with posting and resolving doubts. The application also integrates an AI assistant for answering general questions. It provides functionalities for uploading, downloading, and managing exam-related files, posting and replying to doubts, and interacting with an AI assistant.

## Table of Contents
- [Project Overview](#project-overview-)
- [Features](#features-)
- [API Endpoints](#api-endpoints-)
    - [Authentication API](#authentication-api-)
    - [User API](#user-api-)
    - [UserResponse API](#userresponse-api-)
    - [Doubts API](#doubts-api-)
    - [AI Assistant API](#ai-assistant-api-)
- [Running the Application](#running-the-application-)

## Project Overview 🏠

The **PaperPal** application has been refactored from HTML/CSS/JS to **React** with **TypeScript** for improved type safety and component-based architecture. The application provides a web interface for users to upload, manage, and download exam files. It supports managing user responses and linking those responses to exam files. Additionally, users can interact with an AI assistant powered by **Google Gemini** via the home page. The application also allows users to post and resolve doubts related to exams, fostering better learning and communication.

Moreover, when a PDF is uploaded, it is analyzed by AI to ensure it meets the required guidelines. If the document does not comply, it gets rejected automatically, reducing manual effort in the review process.

## Features 🌟

1. **Question Paper and Notes Upload and Download**:
    - Users can upload exam files and download them by accessing the file details through the application.
    - When a user uploads a PDF, it is analyzed by Google Gemini AI in parallel using multithreading to ensure the file meets guidelines and is study-related.
    - If the file is not related to study materials, it is automatically rejected, reducing manual effort.

2. **Ask AI**:
    - The integrated AI assistant allows users to ask questions, similar to ChatGPT, to get instant responses for better learning and problem-solving.

3. **Doubts Postings**:
    - Users can post doubts, respond to others' doubts, and manage their doubts effectively. This feature promotes collaboration and clarity among students.

## API Endpoints 🔌

### Authentication API 🔑

The Authentication API handles user registration, login, and authentication processes.

- **POST /user/redirectHome**: Registers a new user.
    - **Request Body**: `{ username, email, password }`
    - **Response**: `{ message, token }`

- **POST /user/login**: Authenticates a user and provides a JWT token.
    - **Request Body**: `{ email, password }`
    - **Response**: `{ message, token, userData }`

### User API 🧑‍💻

The User API handles user-related actions such as password management and profile updates.

- **POST /user/changePassword**: Sends an OTP for user verification.
    - **Request Body**: `{ email }`
    - **Response**: `{ message, success }`

- **POST /user/otp**: Verifies the OTP entered by the user.
    - **Request Body**: `{ email, otp }`
    - **Response**: `{ message, success }`

- **PUT /user/setNewPassword**: Changes the user's password.
    - **Request Body**: `{ email, newPassword }`
    - **Response**: `{ message, success }`

- **GET user/activate**: Verifies the code and redirect to homepage.
    -**Request Body**: `{ code }`
    -**Response**: `{ redirect to paperpals.onrender.com}`

### UserResponse API 📚

The UserResponse API manages uploading and retrieving educational files with course-specific metadata and PDF analysis capabilities.

- **POST /userresponse**: Uploads and analyzes educational files.
   - **Headers**: `Authorization: {JWT token}`
   - **Request Body**: `form-data: { course, branch, semester, fileType, file, title, description }`
   - **Response**: `HTTP 200 OK`

- **GET /userresponse/getlinks**: Retrieves download links for files based on course criteria.
   - **Headers**: `Authorization: {JWT token}`
   - **Query Parameters**: `course, branch, semester` (required)
   - **Response**: `{ List<FileDto> }`

### Doubts API 🤔

The Doubts API manages posting, replying to, and retrieving doubts.

- **POST /doubts/postDoubts**: Creates a new doubt.
    - **Headers**: `Authorization: {JWT token}`
    - **Request Body**: `{ title, description }`
    - **Response**: `{ message, doubtData }`

- **GET /doubts/allDoubts**: Retrieves all doubts with optional filtering.
    - **Headers**: `Authorization: {JWT token}`
    - **Query Parameters**: `user, solved` (optional)
    - **Response**: `{ doubts }`

- **GET /doubts/{id}**: Retrieves a specific doubt with its replies.
    - **Headers**: `Authorization: {JWT token}`
    - **Path Parameter**: `id`
    - **Response**: `{ doubt, replies }`

- **POST /doubts/addReply**: Adds a reply to a doubt.
    - **Headers**: `Authorization: {JWT token}`
    - **Path Parameter**: `id`
    - **Request Body**: `{ content }`
    - **Response**: `{ message, reply }`

- **DELETE /doubts/deleteDoubt/{id}**: Deletes a specific doubt.
    - **Headers**: `Authorization: {JWT token}`
    - **Path Parameter**: `id`
    - **Response**: `{ message, success }`

### AI Assistant API 🤖

The AI Assistant API provides interaction with the integrated AI assistant.

- **POST /api/ai/ask**: Sends a query to the AI assistant and receives a response.
    - **Headers**: `Authorization: {JWT token}`
    - **Request Body**: `{ query }`
    - **Response**: `{ answer }`

## Frontend Components 🖼️

The PaperPal application's frontend is built using React with TypeScript, featuring the following key components:

### Authentication Components

- **RegisterForm**: Handles user registration with form validation
- **LoginForm**: Manages user login and authentication
- **PasswordReset**: Facilitates the password reset flow with OTP verification

### Navigation Components

- **Navbar**: Main navigation with responsive design for both mobile and desktop
- **Sidebar**: Context-aware sidebar that changes based on the current section
- **ThemeToggle**: Switches between light and dark themes

### File Management Components

- **FileUpload**: Multi-step form for uploading exam files with metadata
- **FileList**: Displays filterable list of available files with download options
- **FileViewer**: Preview component for PDF files

### Doubts Components

- **DoubtsList**: Displays all doubts with filtering and sorting options
- **DoubtDetail**: Shows a single doubt with all replies and actions
- **DoubtForm**: Form for creating new doubts
- **ReplyForm**: Component for adding replies to existing doubts

### AI Assistant Components

- **AIChatInterface**: Real-time chat interface for interacting with the AI assistant
- **QueryHistory**: Shows previous AI interactions

### Common Components

- **Button**: Reusable button component with various states
- **Modal**: Reusable modal for confirmations and forms
- **Dropdown**: Custom dropdown component for selections
- **Toast**: Notification system for success/error messages
- **LoadingSpinner**: Visual indicator for loading states


## 🚀 Running the Application

To run the application locally, follow these steps:

---

### 🧾 1. Clone the repository

```bash
git clone https://github.com/Medhansh-32/Paper_Pal.git
```

### 📁 2. Navigate to the project directory

#### 👉 For Frontend

```bash
cd Frontend
npm install
npm run dev
```

#### 👉 For Backend

```bash
cd Backend
# Add the required configuration in `application.properties`
mvn clean install
java -jar target/PaperPal-0.0.1-SNAPSHOT.jar
```

### 🐳 3. Alternatively, use Docker Compose (recommended)

If you have Docker and Docker Compose installed, you can run the entire application using:

```bash
docker-compose up --build
```

This will build and start both the **frontend** and **backend** services together.

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

### 🌐 4. Access the Application

- Frontend is available at: http://localhost:5173
- Backend is available at: http://localhost:8080

### ⭐ 5. Enjoy Using the Project?

If you find this project helpful or interesting, don't forget to give it a **⭐ on GitHub**! Your support is greatly appreciated and helps the project grow!

---

## Additional Setup Information

### Prerequisites

- **Node.js** (v14 or higher)
- **Java** (v11 or higher)
- **Maven** (v3.6 or higher)
- **Docker** and **Docker Compose** (for containerized deployment)

### Configuration

Make sure to configure your `application.properties` file in the Backend directory with the necessary database and API configurations before running the application.

### Troubleshooting

If you encounter any issues:

1. Ensure all prerequisites are installed
2. Check that ports 5173 and 8080 are available
3. Verify your `application.properties` configuration
4. For Docker issues, ensure Docker daemon is running

### Support

For additional support or questions, please visit the [GitHub repository](https://github.com/Medhansh-32/Paper_Pal) and create an issue.
