// src/ChatInput.js
import React, { useState } from 'react';

function ChatInput({ sendMessage }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    console.log('handleSend called with input:', input);
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    } else {
      console.log('Input is empty, not sending message.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={styles.chatInput}>
      <textarea
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyPress}
        placeholder="Type your message..."
        style={styles.inputField}
      />
      <button onClick={handleSend} style={styles.sendButton}>
        Send
      </button>
    </div>
  );
}

const styles = {
  chatInput: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  inputField: {
    flexGrow: 1,
    padding: '10px',
    fontSize: '16px',
    resize: 'none',
    height: '50px',
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: '16px',
    marginLeft: '10px',
  },
};

export default ChatInput;
