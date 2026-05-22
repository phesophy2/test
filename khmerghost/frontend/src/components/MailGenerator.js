import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function MailGenerator() {
  const [emailData, setEmailData] = useState(null);
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('mail.tm');

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/mail/generate`, { provider });
      if (response.data.success) {
        setEmailData(response.data);
        setInbox([]);
      } else {
        alert(`Failed: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email');
    } finally {
      setLoading(false);
    }
  };

  const checkInbox = async () => {
    if (!emailData || !emailData.token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/mail/inbox`, {
        params: { 
          token: emailData.token,
          provider: emailData.provider 
        }
      });
      if (response.data.success) {
        setInbox(response.data.messages);
      }
    } catch (error) {
      console.error('Error checking inbox:', error);
      alert('Failed to check inbox');
    } finally {
      setLoading(false);
    }
  };

  const getOTP = async (messageId) => {
    if (!emailData || !emailData.token) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/mail/otp/${messageId}`, {
        params: { 
          token: emailData.token,
          provider: emailData.provider 
        }
      });
      if (response.data.success && response.data.otp) {
        alert(`OTP Found: ${response.data.otp}`);
        navigator.clipboard.writeText(response.data.otp);
      } else {
        alert('No OTP found in this message');
      }
    } catch (error) {
      console.error('Error getting OTP:', error);
      alert('Failed to extract OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h2>📧 Temporary Email Generator</h2>
      
      <div className="action-section">
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            <input
              type="radio"
              value="mail.tm"
              checked={provider === 'mail.tm'}
              onChange={(e) => setProvider(e.target.value)}
            />
            {' '}Mail.tm (Recommended)
          </label>
          <label>
            <input
              type="radio"
              value="guerrilla"
              checked={provider === 'guerrilla'}
              onChange={(e) => setProvider(e.target.value)}
            />
            {' '}Guerrilla Mail
          </label>
        </div>
        
        <button onClick={generateEmail} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Email'}
        </button>
      </div>

      {emailData && (
        <div className="result-section">
          <h3>Your Temporary Email:</h3>
          <div className="email-display">
            <code>{emailData.email}</code>
            <button onClick={() => navigator.clipboard.writeText(emailData.email)}>
              📋 Copy
            </button>
          </div>
          
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6c757d' }}>
            <strong>Provider:</strong> {emailData.provider}<br/>
            <strong>Created:</strong> {new Date(emailData.created_at).toLocaleString()}
            {emailData.password && (
              <>
                <br/><strong>Password:</strong> {emailData.password}
              </>
            )}
          </div>
          
          <button onClick={checkInbox} disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Checking...' : '🔄 Check Inbox'}
          </button>

          {inbox.length > 0 ? (
            <div className="inbox-list">
              <h4>Messages ({inbox.length}):</h4>
              {inbox.map((msg, idx) => (
                <div key={idx} className="message-item">
                  <strong>From:</strong> {msg.from?.address || 'Unknown'}<br/>
                  <strong>Subject:</strong> {msg.subject || 'No subject'}<br/>
                  <small>{new Date(msg.createdAt).toLocaleString()}</small>
                  <button 
                    onClick={() => getOTP(msg.id)}
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

export default MailGenerator;
