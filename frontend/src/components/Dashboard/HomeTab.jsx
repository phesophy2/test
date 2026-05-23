import React from 'react';
import AccountTable from '../AccountTable/AccountTable';
const HomeTab = ({ accounts, selectedAccounts, setSelectedAccounts }) => {
  return (
    <div className="home-tab">
      <div className="config-panel">
        <div className="config-row">
          <label><input type="checkbox" /> Only Login (No Backup Page)</label>
          <label><input type="checkbox" /> Check Primary</label>
          <label><input type="checkbox" /> Check Date Created</label>
        </div>
        <div className="config-row">
          <label><input type="checkbox" /> Check Live before login</label>
          <label><input type="checkbox" /> Sort phone</label>
          <label>MaxChanger: <input type="number" className="small-input" defaultValue={1} /></label>
          <label>1/screen: <input type="number" className="small-input" defaultValue={1} /></label>
        </div>
      </div>
      <AccountTable accounts={accounts} selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts} />
    </div>
  );
};
export default HomeTab;
