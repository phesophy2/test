import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TelegramBot() {
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  const [command, setCommand] = useState('/start');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!chatId || !message) return;
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/bot/send`, {
        chatId,
        message
      });
      if (res.data.success) {
        setResponse(`Message sent! ID: ${res.data.messageId}`);
        setMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleCommand = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/bot/command`, {
        command,
        params: {}
      });
      setResponse(res.data.message);
    } catch (error) {
      console.error('Error handling command:', error);
      alert('Failed to handle command');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h2>🤖 Telegram Bot</h2>
      
      <div className="bot-section">
        <h3>Test Commands</h3>
        <div className="command-buttons">
          <button onClick={() => { setCommand('/start'); handleCommand(); }} disabled={loading}>
            /start
          </button>
          <button onClick={() => { setCommand('/help'); handleCommand(); }} disabled={loading}>
            /help
          </button>
          <button onClick={() => { setCommand('/status'); handleCommand(); }} disabled={loading}>
            /status
          </button>
        </div>
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <h3>Send Message</h3>
        <input
          type="text"
          placeholder="Chat ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {response && (
        <div className="response-section">
          <h4>Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default TelegramBot;
