import React, { useEffect } from 'react';
const AccountTable = ({ accounts, selectedAccounts, setSelectedAccounts }) => {
  useEffect(() => { localStorage.setItem('selectedAccounts', JSON.stringify(selectedAccounts)); }, [selectedAccounts]);
  const toggleSelectAll = () => {
    if(selectedAccounts.length === accounts.length) setSelectedAccounts([]);
    else setSelectedAccounts(accounts.map(acc => acc.id));
  };
  const toggleSelect = (id) => {
    if(selectedAccounts.includes(id)) setSelectedAccounts(selectedAccounts.filter(i=>i!==id));
    else setSelectedAccounts([...selectedAccounts, id]);
  };
  return (
    <div className="account-table-container">
      <table className="account-table">
        <thead>
          <tr><th><input type="checkbox" onChange={toggleSelectAll} checked={selectedAccounts.length===accounts.length && accounts.length>0} /></th>
            <th>No</th><th>Name</th><th>UID</th><th>PASS</th><th>2FA</th><th>Email</th><th>Passmail</th>
            <th>File</th><th>Primary</th><th>Birthday</th><th>e_Crea</th><th>Cookie</th><th>Any_Co</th><th>Note</th><th>Proxy</th><th>State</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, idx) => (
            <tr key={acc.id}>
              <td><input type="checkbox" checked={selectedAccounts.includes(acc.id)} onChange={()=>toggleSelect(acc.id)} /></td>
              <td>{idx+1}</td><td>{acc.name||'-'}</td><td>{acc.uid||'-'}</td><td>{acc.password||'-'}</td>
              <td>{acc.twofa||'-'}</td><td>{acc.email||'-'}</td><td>{acc.emailPass||'-'}</td><td>{acc.file||'-'}</td>
              <td>{acc.primary_check?'✓':'-'}</td><td>{acc.birthday||'-'}</td><td>{acc.e_crea||'-'}</td>
              <td>{acc.cookie?'✓':'-'}</td><td>{acc.any_co||'-'}</td><td>{acc.note||'-'}</td><td>{acc.proxy||'-'}</td>
              <td className={`state-${acc.state}`}>{acc.state||'idle'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AccountTable;
