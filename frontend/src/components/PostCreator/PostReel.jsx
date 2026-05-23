import React, { useState } from 'react';
const PostReel = () => {
  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const addHashtag = () => { if(hashtag.trim()) setHashtags([...hashtags, hashtag.trim()]); setHashtag(''); };
  return (
    <div className="post-section">
      <h3>POST REEL</h3>
      <div className="post-controls">
        <input type="text" placeholder="Add more hashtag" value={hashtag} onChange={(e)=>setHashtag(e.target.value)} />
        <button onClick={addHashtag}>+ Add</button>
        <button className="delete-btn">Delete Post (Acc | Page) x0</button>
      </div>
      <div className="hashtag-list">{hashtags.map((tag,i)=><span key={i} className="hashtag">#{tag}</span>)}</div>
    </div>
  );
};
export default PostReel;
