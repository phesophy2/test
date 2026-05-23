import React, { useState } from 'react';
import PostReel from '../PostCreator/PostReel';
import PostImage from '../PostCreator/PostImage';
import PostVideo from '../PostCreator/PostVideo';
import InteractiveConfig from '../ConfigPanel/InteractiveConfig';
const InteractTab = () => {
  const [delayMin, setDelayMin] = useState(30);
  const [delayMax, setDelayMax] = useState(50);
  return (
    <div className="interact-tab">
      <div className="delay-config">
        <label>Delays Post:</label>
        <input type="number" value={delayMin} onChange={(e)=>setDelayMin(e.target.value)} className="small-input" />
        <span>/s To</span>
        <input type="number" value={delayMax} onChange={(e)=>setDelayMax(e.target.value)} className="small-input" />
        <span>/s</span>
      </div>
      <PostReel /><PostImage /><PostVideo /><InteractiveConfig />
    </div>
  );
};
export default InteractTab;
