# Google Search Engine Powered Conversational AI

This project is an AI-powered conversational assistant built using **Google Generative AI (gemini-1.5-flash)**, designed to assist users with various tasks such as generating responses, performing web searches, fetching content from links, and summarizing key points from conversations.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [File Structure](#file-structure)
6. [Environment Variables](#environment-variables)
7. [Running the Application](#running-the-application)
8. [Debugging](#debugging)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

- **AI-Assisted Conversation**: The application uses Google Generative AI to assist users with detailed and informative responses.
- **Key Points Extraction**: Automatically extracts key points from user messages and updates the conversation context.
- **Decision Making**: The system decides whether to perform a web search, generate an AI response, or open a link based on the user's message and conversation context.
- **Web Search & Content Fetching**: Performs web searches and fetches content from provided links.
- **Markdown-formatted Responses**: Generates well-formatted AI responses using markdown.

---

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js (Google Generative AI via REST API)
- **APIs**:
  - Google Generative AI (gemini-1.5-flash)
  - Custom Web Search and Link Fetcher (via Cloudflare Workers)
- **Other Libraries**: 
  - `@google/generative-ai`
  - `fetch`

---

## Installation

### Prerequisites

- Node.js (v14 or later)
- npm (or yarn)
- A valid Google Generative AI API Key

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ai-conversational-assistant.git
   ```

2. Navigate into the project directory:

   ```bash
   cd ai-conversational-assistant
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and add your Google Generative AI API Key (See [Environment Variables](#environment-variables)).

---

## Usage

### Key Features

- **Send Messages**: Users can send messages through the chat interface.
- **AI Response**: The AI responds based on the user's message and prior conversation context.
- **Web Search**: The assistant can decide to perform a web search or fetch link content based on the user's message.
- **Extract Key Points**: Key points are extracted from both the user's messages and the AI's responses to keep the conversation focused.

### UI Overview

- **Chat Input**: A text field where users can input their queries.
- **Chat History**: Displays the conversation between the user and the assistant.
  
---

## File Structure

```
├── public
├── src
│   ChatHistory.js                # Displays chat history
│   ChatInput.js                  # Input field for user messages
│   aiUtils.js                    # All AI-related functions
│   App.js                        # Main application component
├── .env                          # Environment variables
├── package.json                  # Project configuration and dependencies
├── README.md                     # Project readme
```

---

## Environment Variables

To run this project, you will need to add the following environment variable to your `.env` file:

```plaintext
REACT_APP_API_KEY=your-google-generative-ai-api-key
```

Replace `your-google-generative-ai-api-key` with your actual API key from Google Generative AI.

---

## Running the Application

1. Ensure that your `.env` file is correctly configured with the API key.
2. Start the development server:

   ```bash
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

---

## Debugging

The code includes detailed debug logs using `console.log` to help trace the flow of data and identify issues. Key debug points include:

- **Extracting key points**: Logs extracted key points from both user and AI responses.
- **Decision-making**: Logs the decision on whether to perform a web search, generate a response, or open a link.
- **Web search and fetching content**: Logs the search query generated and the content fetched from links.

To view logs, open your browser's Developer Tools (F12) and go to the Console tab.

---

## Contributing

We welcome contributions! If you have ideas for improving this project or fixing bugs, please submit a pull request. Before contributing, please make sure you:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to your branch (`git push origin feature/new-feature`).
6. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
```

This README provides a comprehensive overview of the project, explaining its features, how to set it up, run it, and contribute. Let me know if you need further customization!
