import React, { useState } from 'react';
const PostVideo = () => {
  const [hashtag, setHashtag] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [recommend, setRecommend] = useState(false);
  const [copyright, setCopyright] = useState(false);
  const addHashtag = () => { if(hashtag.trim()) setHashtags([...hashtags, hashtag.trim()]); setHashtag(''); };
  return (
    <div className="post-section">
      <h3>POST VIDEO</h3>
      <div className="post-controls">
        <input type="text" placeholder="Add more hashtag" value={hashtag} onChange={(e)=>setHashtag(e.target.value)} />
        <button onClick={addHashtag}>+ Add</button>
        <label><input type="checkbox" checked={recommend} onChange={(e)=>setRecommend(e.target.checked)} /> Check Recommendation</label>
        <label><input type="checkbox" checked={copyright} onChange={(e)=>setCopyright(e.target.checked)} /> Copyright</label>
      </div>
      <div className="hashtag-list">{hashtags.map((tag,i)=><span key={i} className="hashtag">#{tag}</span>)}</div>
    </div>
  );
};
export default PostVideo;
