import React, { useState } from 'react';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';
import {
  extractKeyPoints,
  decideAction,
  performWebSearchProcess,
  generateAIResponse,
  fetchLinkContent, // Import fetchLinkContent
} from './aiUtils';

function App() {
  const [messages, setMessages] = useState([]);
  const [conversationContext, setConversationContext] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const apiKey = process.env.REACT_APP_API_KEY;
  const MAX_CONTEXT_LENGTH = 10;

  const sendMessage = async (message) => {
    if (isProcessing) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'assistant',
          text: 'Please wait, I am still processing your previous message.',
        },
      ]);
      return;
    }

    setIsProcessing(true);

    // Add user's message to chat history
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: message },
    ]);

    // Extract key points from the user's message
    const userKeyPoints = await extractKeyPoints(apiKey, message);

    // Update conversation context
    setConversationContext((prevContext) => {
      const newContext = [...prevContext, userKeyPoints];
      return newContext.slice(-MAX_CONTEXT_LENGTH);
    });

    // Decide on action
    const { action, url } = await decideAction(apiKey, message, conversationContext);

    let additionalContext = '';

    if (action === 'web_search') {
      // Perform web search and fetch content from each link
      const searchContext = await performWebSearchProcess(
        apiKey,
        message,
        conversationContext
      );

      additionalContext += searchContext;
      setConversationContext((prevContext) => {
        const newContext = [...prevContext, searchContext];
        return newContext.slice(-MAX_CONTEXT_LENGTH);
      });
    } else if (action === 'openlink' && url) {
      // Fetch content from the specified URL
      const linkContent = await fetchLinkContent(url);
      additionalContext += `\nContent from ${url}:\n${linkContent}`;
      setConversationContext((prevContext) => {
        const newContext = [...prevContext, `Content from ${url}:\n${linkContent}`];
        return newContext.slice(-MAX_CONTEXT_LENGTH);
      });
    }

    // Generate AI response
    try {
      const context = conversationContext.join('\n') + additionalContext;
      const responseText = await generateAIResponse(apiKey, context, message);

      // Add AI's response to chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'assistant', text: responseText },
      ]);

      // Extract key points from the AI's response
      const aiKeyPoints = await extractKeyPoints(apiKey, responseText);

      // Update conversation context
      setConversationContext((prevContext) => {
        const newContext = [...prevContext, aiKeyPoints];
        return newContext.slice(-MAX_CONTEXT_LENGTH);
      });
    } catch (error) {
      console.error('Error fetching from AI API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'assistant',
          text: 'Error: Unable to fetch response.',
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="App" style={styles.app}>
      <ChatHistory messages={messages} />
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
};

export default App;
