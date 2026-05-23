import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import HomeTab from '../components/Dashboard/HomeTab';
import InteractTab from '../components/Dashboard/InteractTab';
import TaskTab from '../components/Dashboard/TaskTab';
import SettingTab from '../components/Dashboard/SettingTab';
import MailProductionTab from '../components/Dashboard/MailProductionTab';
import { api } from '../services/api';

const FarmReel = () => {
  const [activeTab, setActiveTab] = useState('HOME');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [stats, setStats] = useState({ cpu: 0, ram: 0, active: 0, total: 0 });
  
  useEffect(() => {
    loadAccounts();
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const loadAccounts = async () => { const data = await api.getAccounts(); setAccounts(data); };
  const loadStats = async () => { const data = await api.getStats(); setStats(data); };
  
  const renderTab = () => {
    switch(activeTab) {
      case 'HOME': return <HomeTab accounts={accounts} selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts} />;
      case 'INTERACT': return <InteractTab accounts={accounts} />;
      case 'TASK': return <TaskTab />;
      case 'SETTING': return <SettingTab />;
      case 'MAIL': return <MailProductionTab />;
      default: return <HomeTab accounts={accounts} selectedAccounts={selectedAccounts} setSelectedAccounts={setSelectedAccounts} />;
    }
  };
  
  return (
    <div className="farm-reel">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="main-content">
        <Header onRefresh={loadAccounts} />
        <div className="content-area">{renderTab()}</div>
        <Footer stats={stats} totalAccounts={accounts.length} selectedCount={selectedAccounts.length} />
      </div>
    </div>
  );
};
export default FarmReel;
