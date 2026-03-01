# CodeMedic AI 🩺🤖

CodeMedic AI is an intelligent, AI-powered debugging assistant designed to help developers quickly diagnose and fix code issues. Built with a sleek, modern, and responsive UI, it directly integrates the powerful Google Gemini 2.5 Flash model to provide direct, helpful, and concise answers to your programming problems.

**🚀 [Visit the Live App Here!](https://codemedic-ai.onrender.com)**


## ✨ Features

- **Intelligent Debugging**: Ask questions, paste errors, or describe bugs, and get immediate, AI-driven assistance.
- **File Uploads**: Attach multiple code files, text documents, or images (screenshots of errors) directly to your chat for comprehensive context.
- **Syntax Highlighting & Code Blocks**: Beautifully formatted code snippets with language detection and a one-click "Copy" button.
- **Modern & Responsive UI**: A clean, distraction-free interface built with vanilla HTML/CSS/JS, featuring fluid animations and a responsive design for all devices.
- **Dark/Light Mode**: Toggle between themes seamlessly to suit your preference.
- **Secure Architecture**: A Node.js backend acts as a secure proxy to keep your Gemini API keys safe from the client side.

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties, Flexbox), Vanilla JavaScript (ES6+). No heavy frameworks!
- **Backend**: Node.js, Express.js.
- **AI Integration**: Google Gen AI SDK (`@google/genai`) using the `gemini-2.5-flash` model.

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/adityayadav-dev/CodeMedic-Ai.git
   cd CodeMedic-Ai
   ```

2. **Set up the backend:**
   Navigate to the `backend` directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables:**
   Inside the `backend` directory, create a `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

4. **Start the server:**
   While still in the `backend` directory, run:
   ```bash
   npm start
   ```

5. **Open the App:**
   The backend serves the frontend statically. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 🌐 Deployment (e.g., on Render)

CodeMedic AI is structured to be easily deployed on services like Render.

1. Push your repository to GitHub (ensure your `.env` is in `.gitignore` so your API key isn't leaked!).
2. Create a new "Web Service" on Render linked to your repository.
3. **Build Command:** `cd backend && npm install`
4. **Start Command:** `cd backend && npm start`
5. **Environment Variables:** Add `GEMINI_API_KEY` with your key via the Render dashboard.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for UI improvements, new features, or bug fixes.

## 📝 License

This project is open-source and available under the ISC License.
