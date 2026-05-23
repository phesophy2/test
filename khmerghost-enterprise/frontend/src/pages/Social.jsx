import React, { useState, useEffect } from 'react';

const Social = () => {
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('facebook');
  const [postType, setPostType] = useState('post');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  useEffect(() => {
    fetchPlatforms();
    fetchAccounts();
  }, []);

  const fetchPlatforms = async () => {
    const res = await fetch('http://localhost:5001/api/social/platforms');
    const data = await res.json();
    setPlatforms(data);
  };

  const fetchAccounts = async () => {
    const res = await fetch('http://localhost:5001/api/farm/accounts');
    const data = await res.json();
    setAccounts(data);
  };

  const handlePost = async () => {
    if(selectedAccounts.length === 0) return alert('Select accounts first');
    const res = await fetch('http://localhost:5001/api/social/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountIds: selectedAccounts,
        platform: selectedPlatform,
        type: postType,
        content,
        hashtags: hashtags.split(',').map(h => h.trim()),
        mediaUrl,
        scheduleTime: scheduleTime || null
      })
    });
    const data = await res.json();
    alert(data.message);
    setContent('');
    setHashtags('');
    setMediaUrl('');
  };

  const toggleAccount = (id) => {
    if(selectedAccounts.includes(id)) {
      setSelectedAccounts(selectedAccounts.filter(i => i !== id));
    } else {
      setSelectedAccounts([...selectedAccounts, id]);
    }
  };

  return (
    <div>
      <h2>📱 Social Media Manager</h2>
      
      <div className="stats-grid">
        {platforms.map(p => (
          <div key={p.name} className="stat-card">
            <div>{p.name}</div>
            <div className="number">{p.status === 'connected' ? '✅' : '⏳'}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{p.features?.length || 0} features</div>
          </div>
        ))}
      </div>

      <div className="table-container" style={{ marginBottom: 20 }}>
        <h3 style={{ padding: 15 }}>Select Accounts</h3>
        <table>
          <thead>
            <tr><th><input type="checkbox" onChange={(e) => e.target.checked ? setSelectedAccounts(accounts.map(a => a.id)) : setSelectedAccounts([])} /></th><th>Name</th><th>Platform</th><th>Status</th></tr>
          </thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td><input type="checkbox" checked={selectedAccounts.includes(acc.id)} onChange={() => toggleAccount(acc.id)} /></td>
                <td>{acc.name}</td>
                <td>{acc.platform || 'Facebook'}</td>
                <td style={{ color: acc.status === 'running' ? '#00aa55' : '#888' }}>{acc.status || 'idle'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ background: '#0f0f1a', padding: 20, borderRadius: 12 }}>
        <h3>Create Post</h3>
        <div style={{ display: 'grid', gap: 15, marginTop: 15 }}>
          <select value={selectedPlatform} onChange={(e) => setSelectedPlatform(e.target.value)} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }}>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
            <option value="instagram">Instagram</option>
          </select>
          <select value={postType} onChange={(e) => setPostType(e.target.value)} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }}>
            <option value="post">Post</option>
            <option value="reel">Reel</option>
            <option value="story">Story</option>
          </select>
          <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} rows={4} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }} />
          <input type="text" placeholder="Hashtags (comma separated)" value={hashtags} onChange={(e) => setHashtags(e.target.value)} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }} />
          <input type="text" placeholder="Media URL (optional)" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }} />
          <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} style={{ padding: 10, background: '#1a1a2e', border: '1px solid #2a2a3e', color: 'white', borderRadius: 6 }} />
          <button className="btn-primary" onClick={handlePost}>📤 Post Now</button>
        </div>
      </div>
    </div>
  );
};

export default Social;
