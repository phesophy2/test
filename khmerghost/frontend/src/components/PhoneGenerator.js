import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function PhoneGenerator() {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState('US');

  const getNumbers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/phone/numbers`, {
        params: { country }
      });
      if (response.data.success) {
        setNumbers(response.data.numbers);
        setMessages([]);
        setSelectedNumber(null);
      } else {
        alert(`Failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error getting numbers:', error);
      alert('Failed to get phone numbers');
    } finally {
      setLoading(false);
    }
  };

  const selectNumber = (number) => {
    setSelectedNumber(number);
    setMessages([]);
  };

  const checkMessages = async () => {
    if (!selectedNumber) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/phone/messages`, {
        params: { url: selectedNumber.url }
      });
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error checking messages:', error);
      alert('Failed to check messages');
    } finally {
      setLoading(false);
    }
  };

  const extractOTP = (text) => {
    const otpMatch = text.match(/\b\d{4,8}\b/);
    if (otpMatch) {
      navigator.clipboard.writeText(otpMatch[0]);
      alert(`OTP Copied: ${otpMatch[0]}`);
    } else {
      alert('No OTP found in this message');
    }
  };

  return (
    <div className="component-container">
      <h2>📱 Temporary Phone Generator</h2>
      
      <div className="action-section">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            Country:
            <select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              style={{ marginLeft: '0.5rem', padding: '0.5rem' }}
            >
              <option value="US">🇺🇸 United States</option>
              <option value="UK">🇬🇧 United Kingdom</option>
              <option value="CA">🇨🇦 Canada</option>
            </select>
          </label>
        </div>
        
        <button onClick={getNumbers} disabled={loading}>
          {loading ? 'Loading...' : 'Get Free Numbers'}
        </button>
      </div>

      {numbers.length > 0 && (
        <div className="result-section">
          <h3>Available Numbers ({numbers.length}):</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {numbers.map((num, idx) => (
              <div 
                key={idx} 
                className="message-item"
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: selectedNumber?.number === num.number ? '#e7f3ff' : 'white'
                }}
                onClick={() => selectNumber(num)}
              >
                <strong>{num.display}</strong>
                <span style={{ marginLeft: '1rem', fontSize: '0.85rem', color: '#6c757d' }}>
                  {num.country} • {num.provider}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedNumber && (
        <div className="result-section" style={{ marginTop: '1rem' }}>
          <h3>Selected Number:</h3>
          <div className="phone-display">
            <code>{selectedNumber.display}</code>
            <button onClick={() => navigator.clipboard.writeText(selectedNumber.number)}>
              📋 Copy
            </button>
          </div>
          
          <button onClick={checkMessages} disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Checking...' : '🔄 Check Messages'}
          </button>

          {messages.length > 0 ? (
            <div className="sms-list">
              <h4>Messages ({messages.length}):</h4>
              {messages.map((msg, idx) => (
                <div key={idx} className="message-item">
                  <strong>From:</strong> {msg.from}<br/>
                  <strong>Message:</strong> {msg.text}<br/>
                  <small>{msg.time}</small>
                  <button 
                    onClick={() => extractOTP(msg.text)}
                    style={{ marginLeft: '1rem', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                  >
                    Extract OTP
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-messages">No messages yet. Check back in a few seconds.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PhoneGenerator;
