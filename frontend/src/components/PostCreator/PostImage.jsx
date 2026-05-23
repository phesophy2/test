import React, { useState } from 'react';
const PostImage = () => {
  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [marketplace, setMarketplace] = useState(false);
  const addHashtag = () => { if(hashtag.trim()) setHashtags([...hashtags, hashtag.trim()]); setHashtag(''); };
  return (
    <div className="post-section">
      <h3>POST IMAGE</h3>
      <div className="post-controls">
        <input type="text" placeholder="Add more hashtag" value={hashtag} onChange={(e)=>setHashtag(e.target.value)} />
        <button onClick={addHashtag}>+ Add</button>
        <label><input type="checkbox" checked={marketplace} onChange={(e)=>setMarketplace(e.target.checked)} /> Check Marketplace</label>
      </div>
      <div className="hashtag-list">{hashtags.map((tag,i)=><span key={i} className="hashtag">#{tag}</span>)}</div>
    </div>
  );
};
export default PostImage;
