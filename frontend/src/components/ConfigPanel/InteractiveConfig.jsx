import React, { useState } from 'react';
const InteractiveConfig = () => {
  const [limitPost, setLimitPost] = useState(false);
  const [checkReach, setCheckReach] = useState(false);
  const [checkPageInvite, setCheckPageInvite] = useState(false);
  return (
    <div className="interactive-config">
      <h3>Interactive configs</h3>
      <div className="config-row">
        <label><input type="checkbox" checked={limitPost} onChange={(e)=>setLimitPost(e.target.checked)} /> Limit Post</label>
        <label><input type="checkbox" checked={checkReach} onChange={(e)=>setCheckReach(e.target.checked)} /> Check Reach</label>
        <label><input type="checkbox" checked={checkPageInvite} onChange={(e)=>setCheckPageInvite(e.target.checked)} /> Check Page Invite</label>
      </div>
    </div>
  );
};
export default InteractiveConfig;
