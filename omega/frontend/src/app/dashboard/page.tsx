'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BatchJob {
  id: string;
  name: string;
  type: string;
  target: string;
  status: 'completed' | 'running' | 'failed' | 'queued';
  progress: number;
  date: string;
}

interface SocialAccount {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'tiktok' | 'youtube';
  status: 'active' | 'expired' | 'restricted';
  followers: string;
  avatar: string;
}

interface GeneratedFBAccount {
  id: string;
  name: string;
  email: string;
  status: 'verifying' | 'created' | 'checkpoint' | 'failed';
  proxy: string;
  date: string;
}

interface RenderedVideo {
  id: string;
  title: string;
  platform: 'tiktok' | 'reels' | 'shorts';
  duration: string;
  status: 'rendering' | 'completed' | 'failed';
  date: string;
  thumbnail: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>({ fullName: 'KhmerGhost Premium Admin', email: 'admin@khmerghost.com', tenantSubdomain: 'omega-workspace' });
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('video-creator'); // Set active tab to new video creator page

  // Multi-page navigation tabs definition
  const navItems = [
    { id: 'video-creator', name: 'AI Video Creator', icon: '🎬✨' },
    { id: 'fb-creator', name: 'Bulk FB Creator', icon: '👤✨' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'accounts', name: 'Social Accounts', icon: '👥' },
    { id: 'posts', name: 'Bulk Posts Planner', icon: '📝' },
    { id: 'analytics', name: 'Real-time Analytics', icon: '📈' },
    { id: 'marketplace', name: 'OMEGA Marketplace', icon: '🛒' },
    { id: 'gamification', name: 'Quests & Badges', icon: '🏆' },
    { id: 'settings', name: 'Global Settings', icon: '⚙️' },
  ];

  // AI Video Creator Wizard State
  const [videoPrompt, setVideoPrompt] = useState('Top 5 AI Tools that will make you rich in 2026');
  const [videoPlatform, setVideoPlatform] = useState<'tiktok' | 'reels' | 'shorts'>('tiktok');
  const [voiceActor, setVoiceActor] = useState('Khmer Female (SreyNeang)');
  const [bgMusic, setBgMusic] = useState('Upbeat Lo-Fi');
  const [isRendering, setIsRendering] = useState(false);
  const [renderingProgress, setRenderingProgress] = useState(0);
  const [renderingLogs, setRenderingLogs] = useState<string[]>([]);

  // Rendered Videos State
  const [renderedVideos, setRenderedVideos] = useState<RenderedVideo[]>([
    { id: 'VID-091', title: 'Why OMEGA Automator is King', platform: 'shorts', duration: '0:58', status: 'completed', date: '2026-05-23', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80' },
    { id: 'VID-092', title: 'Make $100/day automatically', platform: 'tiktok', duration: '0:45', status: 'completed', date: '2026-05-23', thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=120&auto=format&fit=crop&q=80' },
    { id: 'VID-093', title: '5 Secret Facebook Hacks', platform: 'reels', duration: '1:00', status: 'failed', date: '2026-05-22', thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80' },
  ]);

  // FB Account Creator Wizard State
  const [firstNameList, setFirstNameList] = useState('Somnang, Phirun, Seyha, Sophea, Visal');
  const [lastNameList, setLastNameList] = useState('Chan, Sok, Keo, Long, Tep');
  const [creationCount, setCreationCount] = useState(5);
  const [creatorProxy, setCreatorProxy] = useState('http://kh-premium.proxies.net:5000');
  const [smsProvider, setSmsProvider] = useState('simsms.org');
  const [isCreating, setIsCreating] = useState(false);
  const [creationProgress, setCreationProgress] = useState(0);
  const [creationLogs, setCreationLogs] = useState<string[]>([]);

  // Generated Facebook Accounts State
  const [generatedAccounts, setGeneratedAccounts] = useState<GeneratedFBAccount[]>([
    { id: 'FB-9821', name: 'Somnang Sok', email: 'somnang.sok.321@fbmail.com', status: 'created', proxy: '103.85.22.11:8080', date: '2026-05-23' },
    { id: 'FB-9822', name: 'Phirun Keo', email: 'phirun.keo.881@fbmail.com', status: 'created', proxy: '103.85.22.14:8080', date: '2026-05-23' },
    { id: 'FB-9823', name: 'Seyha Long', email: 'seyha.long.002@fbmail.com', status: 'checkpoint', proxy: '103.85.22.19:8080', date: '2026-05-22' },
  ]);

  // Dummy batch jobs data matching Facebook Business Suite Bulk Tool design
  const [jobs, setJobs] = useState<BatchJob[]>([
    { id: 'JOB-001', name: 'Auto-Post Content Pipeline', type: 'Publisher', target: '5 Facebook Pages', status: 'completed', progress: 100, date: '2026-05-23' },
    { id: 'JOB-002', name: 'Bulk Comment Responder', type: 'Engagement', target: '12 Posts', status: 'running', progress: 68, date: '2026-05-23' },
    { id: 'JOB-003', name: 'Target Audience Sync', type: 'Audience Sync', target: 'Ad Set #419', status: 'failed', progress: 45, date: '2026-05-22' },
    { id: 'JOB-004', name: 'Lead Form Data Export', type: 'Exporter', target: 'Campaign OMEGA', status: 'completed', progress: 100, date: '2026-05-21' },
    { id: 'JOB-005', name: 'Group Auto-Poster scheduler', type: 'Scheduler', target: '8 Communities', status: 'queued', progress: 0, date: '2026-05-20' },
  ]);

  // Social Accounts Data
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    { id: 'ACC-01', name: 'KhmerGhost News Portal', platform: 'facebook', status: 'active', followers: '154.2K', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
    { id: 'ACC-02', name: '@omega.automation', platform: 'instagram', status: 'active', followers: '42.9K', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { id: 'ACC-03', name: 'Viral Tech Clips', platform: 'tiktok', status: 'active', followers: '891.0K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { id: 'ACC-04', name: 'KhmerGhost Media Group', platform: 'facebook', status: 'restricted', followers: '2.4M', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { id: 'ACC-05', name: 'OMEGA Dev Tutorial Hub', platform: 'youtube', status: 'expired', followers: '12.5K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  ]);

  useEffect(() => {
    setMounted(true);
    // Theme setup
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDark(true);
    }

    // Optional localStorage check (non-blocking)
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {}
    }
  }, [router]);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  const toggleSelectJob = (id: string) => {
    if (selectedJobs.includes(id)) {
      setSelectedJobs(selectedJobs.filter(item => item !== id));
    } else {
      setSelectedJobs([...selectedJobs, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(j => j.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedJobs.length} selected job(s)?`)) {
      setJobs(jobs.filter(job => !selectedJobs.includes(job.id)));
      setSelectedJobs([]);
    }
  };

  const handleBulkRetry = () => {
    setJobs(jobs.map(job => {
      if (selectedJobs.includes(job.id)) {
        return { ...job, status: 'running', progress: 10 };
      }
      return job;
    }));
    setSelectedJobs([]);
  };

  const handleCreateJob = () => {
    const newJob: BatchJob = {
      id: `JOB-00${jobs.length + 1}`,
      name: `New Quick Batch Job #${jobs.length + 1}`,
      type: 'Ad-hoc Task',
      target: 'Social Channels',
      status: 'queued',
      progress: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setJobs([newJob, ...jobs]);
  };

  // Run bulk FB creation simulation
  const handleStartFBCreation = () => {
    setIsCreating(true);
    setCreationProgress(5);
    setCreationLogs([`[${new Date().toLocaleTimeString()}] Initializing automated registration engine...`]);

    const firstNames = firstNameList.split(',').map(s => s.trim());
    const lastNames = lastNameList.split(',').map(s => s.trim());

    setTimeout(() => {
      setCreationProgress(25);
      setCreationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Connected to simulation proxylist. Agent: Android 12 Chrome.`]);
    }, 1500);

    setTimeout(() => {
      setCreationProgress(50);
      setCreationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Requesting SMS temporary phone numbers from ${smsProvider}...`]);
    }, 3000);

    setTimeout(() => {
      setCreationProgress(80);
      const generatedName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
      const fakeEmail = `${generatedName.toLowerCase().replace(' ', '.')}@fbmail.com`;
      
      setGeneratedAccounts(prev => [
        {
          id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
          name: generatedName,
          email: fakeEmail,
          status: 'created',
          proxy: '103.85.22.42:8080',
          date: new Date().toISOString().split('T')[0]
        },
        ...prev
      ]);

      setCreationLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Successfully registered: ${generatedName} (${fakeEmail}). Saved cookies.`]);
      setCreationProgress(100);
    }, 5000);

    setTimeout(() => {
      setIsCreating(false);
    }, 5500);
  };

  // Run AI Video compilation rendering simulation
  const handleStartVideoRender = () => {
    setIsRendering(true);
    setRenderingProgress(5);
    setRenderingLogs([`[${new Date().toLocaleTimeString()}] Generating AI Script for topic: "${videoPrompt}"...`]);

    setTimeout(() => {
      setRenderingProgress(30);
      setRenderingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Synthesizing voiceover narration with ${voiceActor}...`]);
    }, 1500);

    setTimeout(() => {
      setRenderingProgress(60);
      setRenderingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Merging video layouts with audio track: ${bgMusic}...`]);
    }, 3000);

    setTimeout(() => {
      setRenderingProgress(90);
      setRenderingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] FFmpeg rendering short video asset...`]);
    }, 4500);

    setTimeout(() => {
      setRenderingProgress(100);
      setRenderedVideos(prev => [
        {
          id: `VID-${Math.floor(100 + Math.random() * 900)}`,
          title: videoPrompt,
          platform: videoPlatform,
          duration: '0:55',
          status: 'completed',
          date: new Date().toISOString().split('T')[0],
          thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2079?w=120&auto=format&fit=crop&q=80'
        },
        ...prev
      ]);
      setRenderingLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Render Complete! Saved to short video local library.`]);
    }, 6000);

    setTimeout(() => {
      setIsRendering(false);
    }, 6500);
  };

  if (!mounted) return null;
  if (!user) return null;

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-shell" style={{ display: 'flex' }}>
      {/* ── Left Sidebar Navigation Panel ── */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
        <div>
          {/* Logo block */}
          <div className="logo-block" style={{ marginBottom: '2rem' }}>
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, var(--primary), #8b5cf6)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="logo-text" style={{ color: 'var(--fg)', fontSize: '1rem', fontWeight: 800 }}>KhmerGhost</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === item.id ? 'var(--primary)' : 'var(--fg-muted)',
                  cursor: 'pointer',
                  fontWeight: activeTab === item.id ? 600 : 500,
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  transition: 'all 0.15s'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <div style={{
            background: 'var(--bg)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            marginBottom: '1rem',
            border: '1px solid var(--border)'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Plan</p>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: '2px 0 6px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
              👑 OMEGA Enterprise
            </p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '84%' }} />
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', marginTop: 6 }}>8,421 / 10,000 requests</p>
          </div>
          
          <button className="btn-icon" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'var(--destructive)', borderColor: 'var(--destructive)' }}>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Right Dashboard Layout Panel ── */}
      <div className="dashboard-main" style={{ flex: 1, minWidth: 0 }}>
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize' }}>
              📁 Workspace: <span style={{ color: 'var(--primary)' }}>{user.tenantSubdomain}</span>
            </span>
          </div>

          <div className="topbar-actions">
            <span style={{ fontSize: '0.85rem', color: 'var(--fg-muted)', fontWeight: 500 }}>
              👤 {user.fullName}
            </span>
            
            <button className="topbar-theme-btn" onClick={toggleTheme} aria-label="Toggle Theme">
              {dark ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* ── Pages Switching Render Content ── */}
        <main className="dashboard-content animate-in">

          {/* TAB -1: AI VIDEO CONTENT CREATOR */}
          {activeTab === 'video-creator' && (
            <div>
              <div style={{ marginBottom: '2.0rem' }}>
                <h1 className="page-heading">AI Video & Reels Creator</h1>
                <p className="page-subheading">Generate high-converting TikToks, Facebook Reels, and YouTube Shorts from text prompts in bulk.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start', marginBottom: '2rem' }}>
                {/* Generation Wizard Card */}
                <div className="card" style={{ maxWidth: '100%' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Video Render Composer</h2>
                  
                  <div className="form-group">
                    <label className="form-label">Video Idea / Prompt</label>
                    <textarea 
                      value={videoPrompt}
                      onChange={e => setVideoPrompt(e.target.value)}
                      placeholder="e.g. 5 motivational quotes for developers..."
                      className="form-input no-icon" 
                      style={{ height: '70px', paddingTop: 10, paddingBottom: 10 }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Target Format</label>
                      <select 
                        value={videoPlatform} 
                        onChange={e => setVideoPlatform(e.target.value as any)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border)',
                          background: 'var(--input-bg)',
                          color: 'var(--fg)',
                          outline: 'none'
                        }}
                      >
                        <option value="tiktok">TikTok (9:16)</option>
                        <option value="reels">FB Reels (9:16)</option>
                        <option value="shorts">YT Shorts (9:16)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">AI Voice Actor</label>
                      <select 
                        value={voiceActor} 
                        onChange={e => setVoiceActor(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border)',
                          background: 'var(--input-bg)',
                          color: 'var(--fg)',
                          outline: 'none'
                        }}
                      >
                        <option value="Khmer Female (SreyNeang)">Khmer Female (SreyNeang)</option>
                        <option value="Khmer Male (Sokha)">Khmer Male (Sokha)</option>
                        <option value="English Male (Adam)">English Male (Adam)</option>
                        <option value="English Female (Bella)">English Female (Bella)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Background Sound / Music</label>
                    <select 
                      value={bgMusic} 
                      onChange={e => setBgMusic(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid var(--border)',
                        background: 'var(--input-bg)',
                        color: 'var(--fg)',
                        outline: 'none'
                      }}
                    >
                      <option value="Upbeat Lo-Fi">Upbeat Lo-Fi</option>
                      <option value="Cinematic Beats">Cinematic Beats</option>
                      <option value="Viral TikTok Synthwave">Viral TikTok Synthwave</option>
                      <option value="No background music">No background music</option>
                    </select>
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={handleStartVideoRender} 
                    disabled={isRendering}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {isRendering ? (
                      <>
                        <div className="spinner" style={{ marginRight: 6 }} />
                        Compiling and Rendering Video...
                      </>
                    ) : (
                      '🎬 Render AI Video Asset'
                    )}
                  </button>
                </div>

                {/* Automation Log Monitor Card */}
                <div className="card" style={{ maxWidth: '100%', background: '#0a0d14', borderColor: '#1f293d', color: '#10b981' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🖥️ Render System Logger
                    {isRendering && <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '1px 6px' }}><span className="badge-dot" />Rendering</span>}
                  </h2>
                  
                  {isRendering && (
                    <div style={{ marginBottom: 12 }}>
                      <div className="progress-bar" style={{ background: '#1e293b' }}>
                        <div className="progress-fill" style={{ width: `${renderingProgress}%`, background: 'linear-gradient(90deg, #10b981, #06b6d4)' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>FFmpeg rendering: {renderingProgress}%</span>
                    </div>
                  )}

                  <div style={{
                    height: '220px',
                    overflowY: 'auto',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: 8
                  }}>
                    {renderingLogs.length === 0 ? (
                      <span style={{ color: '#64748b' }}>System idle. Enter video prompt and click "Render AI Video Asset" to start generation pipeline.</span>
                    ) : (
                      renderingLogs.map((log, index) => (
                        <div key={index} style={{ lineBreak: 'anywhere' }}>{log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Output rendered videos list */}
              <div className="table-card">
                <div className="table-toolbar">
                  <span className="toolbar-title">AI Video Output Gallery</span>
                  <div className="toolbar-actions">
                    <button className="btn-icon primary" onClick={() => alert('Publishing bulk campaigns!')}>🚀 Bulk Publish Selected</button>
                    <button className="btn-icon" onClick={() => alert('Videos Downloaded!')}>⬇️ Download Raw MP4s</button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Preview</th>
                        <th>Video Title</th>
                        <th>Target Channel</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Generation Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderedVideos.map(video => (
                        <tr key={video.id}>
                          <td>
                            <img src={video.thumbnail} alt={video.title} style={{ width: 64, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid var(--border)' }} />
                          </td>
                          <td style={{ fontWeight: 600 }}>{video.title}</td>
                          <td style={{ textTransform: 'capitalize' }}>{video.platform}</td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--fg-muted)' }}>{video.duration}</td>
                          <td>
                            <span className={`badge badge-${video.status === 'completed' ? 'success' : video.status === 'rendering' ? 'info' : 'error'}`}>
                              <span className="badge-dot" />
                              {video.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ color: 'var(--fg-muted)', fontSize: '0.85rem' }}>{video.date}</td>
                          <td>
                            <button className="btn-icon" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => alert(`Auto-publishing ${video.title}...`)}>
                              🚀 Auto-Publish
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 0: BULK FB ACCOUNT CREATOR */}
          {activeTab === 'fb-creator' && (
            <div>
              <div style={{ marginBottom: '2.0rem' }}>
                <h1 className="page-heading">Bulk Facebook Account Creator</h1>
                <p className="page-subheading">Automatically register, verify, and output multiple bulk Facebook accounts utilizing rotational SMS SIM systems.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start', marginBottom: '2rem' }}>
                {/* Generator Settings Card */}
                <div className="card" style={{ maxWidth: '100%' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>Account Register Rules</h2>
                  
                  <div className="form-group">
                    <label className="form-label">First Name Tags (Separated by comma)</label>
                    <input 
                      type="text" 
                      value={firstNameList} 
                      onChange={e => setFirstNameList(e.target.value)}
                      className="form-input no-icon" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name Tags (Separated by comma)</label>
                    <input 
                      type="text" 
                      value={lastNameList} 
                      onChange={e => setLastNameList(e.target.value)}
                      className="form-input no-icon" 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">SMS Verification Gateway</label>
                      <select 
                        value={smsProvider} 
                        onChange={e => setSmsProvider(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--border)',
                          background: 'var(--input-bg)',
                          color: 'var(--fg)',
                          outline: 'none'
                        }}
                      >
                        <option value="simsms.org">SimSMS.org</option>
                        <option value="sms-activate.org">SMS-Activate.org</option>
                        <option value="5sim.net">5SIM.net</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Generate Quantity</label>
                      <input 
                        type="number" 
                        value={creationCount} 
                        onChange={e => setCreationCount(parseInt(e.target.value) || 1)}
                        className="form-input no-icon" 
                        min="1" 
                        max="50"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Proxy Setup</label>
                    <input 
                      type="text" 
                      value={creatorProxy} 
                      onChange={e => setCreatorProxy(e.target.value)}
                      className="form-input no-icon" 
                    />
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={handleStartFBCreation} 
                    disabled={isCreating}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {isCreating ? (
                      <>
                        <div className="spinner" style={{ marginRight: 6 }} />
                        Creating Facebook Account...
                      </>
                    ) : (
                      '🚀 Start Automated FB Creator'
                    )}
                  </button>
                </div>

                {/* Automation Log Monitor Card */}
                <div className="card" style={{ maxWidth: '100%', background: '#0a0d14', borderColor: '#1f293d', color: '#38bdf8' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 6 }}>
                    🖥️ System Action Logger
                    {isCreating && <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '1px 6px' }}><span className="badge-dot" />Running</span>}
                  </h2>
                  
                  {isCreating && (
                    <div style={{ marginBottom: 12 }}>
                      <div className="progress-bar" style={{ background: '#1e293b' }}>
                        <div className="progress-fill" style={{ width: `${creationProgress}%` }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4, display: 'block' }}>Registration progress: {creationProgress}%</span>
                    </div>
                  )}

                  <div style={{
                    height: '240px',
                    overflowY: 'auto',
                    fontFamily: 'Courier New, monospace',
                    fontSize: '0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: 8
                  }}>
                    {creationLogs.length === 0 ? (
                      <span style={{ color: '#64748b' }}>No active processes. Click "Start Automated FB Creator" above to spawn registration routines.</span>
                    ) : (
                      creationLogs.map((log, index) => (
                        <div key={index} style={{ lineBreak: 'anywhere' }}>{log}</div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Output / Generated accounts list table */}
              <div className="table-card">
                <div className="table-toolbar">
                  <span className="toolbar-title">Generated Facebook Accounts</span>
                  <div className="toolbar-actions">
                    <button className="btn-icon" onClick={() => alert('Cookies Exported!')}>🍪 Export Account Cookies</button>
                    <button className="btn-icon" onClick={() => alert('Credentials Exported!')}>🔑 Export logins (User:Pass:OTP)</button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Profile Name</th>
                        <th>Email / Username</th>
                        <th>Target Proxy</th>
                        <th>Status</th>
                        <th>Registration Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedAccounts.map(acc => (
                        <tr key={acc.id}>
                          <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{acc.id}</td>
                          <td style={{ fontWeight: 600 }}>{acc.name}</td>
                          <td>{acc.email}</td>
                          <td style={{ color: 'var(--fg-muted)', fontSize: '0.85rem' }}>{acc.proxy}</td>
                          <td>
                            <span className={`badge badge-${acc.status === 'created' ? 'success' : acc.status === 'checkpoint' ? 'warning' : 'error'}`}>
                              <span className="badge-dot" />
                              {acc.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ color: 'var(--fg-muted)', fontSize: '0.85rem' }}>{acc.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD (Facebook Suite Bulk operations) */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h1 className="page-heading">Facebook Suite Bulk Operations</h1>
                  <p className="page-subheading">Manage, schedule, and view automated social campaigns in batches.</p>
                </div>
                <button className="btn-primary" onClick={handleCreateJob} style={{ width: 'auto', padding: '10px 18px', marginTop: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ marginRight: 4 }}>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Bulk Action
                </button>
              </div>

              {/* Stats */}
              <section className="stat-grid">
                <div className="stat-card">
                  <p className="stat-label">Total Bulk Jobs</p>
                  <p className="stat-value">{jobs.length}</p>
                  <p className="stat-change">Active automation suite</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Running Tasks</p>
                  <p className="stat-value" style={{ color: 'var(--primary)' }}>{jobs.filter(j => j.status === 'running').length}</p>
                  <p className="stat-change" style={{ color: 'var(--primary)' }}>Real-time execution</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Success Rate</p>
                  <p className="stat-value" style={{ color: '#10b981' }}>92.4%</p>
                  <p className="stat-change" style={{ color: '#10b981' }}>+2.1% from last week</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Total Channels Linked</p>
                  <p className="stat-value">25</p>
                  <p className="stat-change">Uptime 99.98%</p>
                </div>
              </section>

              {/* Bulk operations bar */}
              {selectedJobs.length > 0 && (
                <div className="card animate-in" style={{ maxWidth: '100%', padding: '1.25rem 1.5rem', marginBottom: '1.5rem', background: 'var(--primary-light)', borderColor: 'var(--primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9375rem' }}>
                      ⚡ Selected {selectedJobs.length} Operations for Batch Actions:
                    </span>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button className="btn-icon primary" onClick={handleBulkRetry} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        🔄 Run Selected
                      </button>
                      <button className="btn-icon" onClick={handleBulkDelete} style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--destructive)', borderColor: 'var(--destructive)' }}>
                        🗑️ Stop / Remove Selected
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table Card */}
              <div className="table-card">
                <div className="table-toolbar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 260 }}>
                    <div className="input-wrapper" style={{ flex: 1 }}>
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                      <input
                        type="text"
                        placeholder="Search by name, ID or type..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: '0.875rem' }}
                      />
                    </div>
                    
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border)',
                        background: 'var(--bg-card)',
                        color: 'var(--fg)',
                        outline: 'none',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="completed">Completed</option>
                      <option value="running">Running</option>
                      <option value="failed">Failed</option>
                      <option value="queued">Queued</option>
                    </select>
                  </div>

                  <div className="toolbar-actions">
                    <button className="btn-icon" onClick={() => alert('Export CSV Triggered!')}>Export CSV</button>
                    <button className="btn-icon" onClick={() => alert('Import Batch Template Triggered!')}>Import Template</button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th style={{ width: 40, textAlign: 'center' }}>
                          <input type="checkbox" checked={filteredJobs.length > 0 && selectedJobs.length === filteredJobs.length} onChange={toggleSelectAll} />
                        </th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Target / Channels</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Execution Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--fg-muted)' }}>
                            No automation batch operations found matching your search.
                          </td>
                        </tr>
                      ) : (
                        filteredJobs.map(job => (
                          <tr key={job.id} style={{ background: selectedJobs.includes(job.id) ? 'var(--primary-light)' : 'transparent' }}>
                            <td style={{ textAlign: 'center' }}>
                              <input type="checkbox" checked={selectedJobs.includes(job.id)} onChange={() => toggleSelectJob(job.id)} />
                            </td>
                            <td style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--primary)' }}>{job.id}</td>
                            <td><div style={{ fontWeight: 500 }}>{job.name}</div></td>
                            <td><span style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)' }}>{job.type}</span></td>
                            <td><div style={{ fontSize: '0.85rem' }}>{job.target}</div></td>
                            <td>
                              <span className={`badge badge-${job.status === 'completed' ? 'success' : job.status === 'running' ? 'info' : job.status === 'failed' ? 'error' : 'warning'}`}>
                                <span className="badge-dot" />
                                {job.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ minWidth: 120 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div className="progress-bar" style={{ flex: 1 }}>
                                  <div className="progress-fill" style={{ width: `${job.progress}%` }} />
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: 32 }}>{job.progress}%</span>
                              </div>
                            </td>
                            <td style={{ color: 'var(--fg-muted)', fontSize: '0.8125rem' }}>{job.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOCIAL ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h1 className="page-heading">Social Accounts</h1>
                  <p className="page-subheading">Manage your linked profiles, pages, and channels in one workspace.</p>
                </div>
                <button className="btn-primary" onClick={() => alert('Integrate Auth Provider!')} style={{ width: 'auto', padding: '10px 18px', marginTop: 0 }}>
                  🔌 Link Social Account
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {accounts.map(acc => (
                  <div key={acc.id} className="card" style={{ maxWidth: '100%', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={acc.avatar} alt={acc.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9375rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ textTransform: 'capitalize' }}>{acc.platform}</span> • {acc.followers} followers
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={`badge badge-${acc.status === 'active' ? 'success' : acc.status === 'expired' ? 'warning' : 'error'}`}>
                        {acc.status.toUpperCase()}
                      </span>
                      <button className="btn-icon" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => alert(`Settings for ${acc.name}`)}>
                        ⚙️ Configure
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: BULK POSTS PLANNER */}
          {activeTab === 'posts' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <div className="card" style={{ maxWidth: '100%' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Compose Bulk Post Campaign</h2>
                <form onSubmit={(e) => { e.preventDefault(); alert('Bulk Campaign Scheduled Successfully!'); }}>
                  <div className="form-group">
                    <label className="form-label">Post Content / Caption</label>
                    <textarea 
                      placeholder="Write your visual, engaging automation script content..." 
                      className="form-input no-icon" 
                      style={{ height: '140px', resize: 'vertical', paddingTop: 10, paddingBottom: 10 }}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Attached Media URL (Image or Video)</label>
                    <input type="text" placeholder="https://image-library.com/sample.jpg" className="form-input no-icon" />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Target Accounts</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      {accounts.map(acc => (
                        <label key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked={acc.status === 'active'} />
                          {acc.name} ({acc.platform})
                        </label>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                    🚀 Schedule Multi-Channel Bulk Post
                  </button>
                </form>
              </div>

              <div className="card" style={{ maxWidth: '100%' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Bulk Campaign Rules</h3>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--fg-muted)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <li>Auto-rotates IP tags to prevent social channel restrictions.</li>
                  <li>Incorporate spin-tax support to vary content captions automatically.</li>
                  <li>Schedule delays randomized between 60-120 seconds to replicate human behaviour.</li>
                  <li>Direct integration into high-speed proxy pipelines.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: REAL-TIME ANALYTICS */}
          {activeTab === 'analytics' && (
            <div>
              <h1 className="page-heading" style={{ marginBottom: '1.5rem' }}>Real-time Campaign Analytics</h1>
              
              <div className="stat-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card">
                  <p className="stat-label">Total Reach</p>
                  <p className="stat-value" style={{ color: 'var(--primary)' }}>4.8M</p>
                  <p className="stat-change">+14.2% Growth</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Engagement Ratio</p>
                  <p className="stat-value" style={{ color: '#10b981' }}>8.94%</p>
                  <p className="stat-change">+0.8% Increase</p>
                </div>
                <div className="stat-card">
                  <p className="stat-label">Click-through Rate</p>
                  <p className="stat-value" style={{ color: '#f59e0b' }}>3.21%</p>
                  <p className="stat-change">+0.12% Growth</p>
                </div>
              </div>

              <div className="card" style={{ maxWidth: '100%', padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Visual Insights Chart</h2>
                <div style={{
                  height: '220px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px dashed var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--fg-muted)'
                }}>
                  📊 [Interactive Reach vs. Engagement Analytics Line Chart Placeholder]
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: OMEGA MARKETPLACE */}
          {activeTab === 'marketplace' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-heading">OMEGA Automation Marketplace</h1>
                <p className="page-subheading">Buy and deploy pre-built scraping routines, responders and posting templates.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
                {[
                  { name: 'FB Leads Extractor Script', desc: 'Extract contact emails and phone profiles from public group events seamlessly.', price: '$19', dev: 'KhmerGhost Official' },
                  { name: 'Instagram DM Autopilot Flow', desc: 'AI-guided auto DM response flow with support for NLP sentiment analyzers.', price: '$29', dev: 'Automation Labs' },
                  { name: 'TikTok Viral Sound Monitor', desc: 'Automatically scrap daily trending audio metrics and alert target campaigns.', price: '$15', dev: 'Media Wizards' },
                ].map((item, idx) => (
                  <div key={idx} className="card" style={{ maxWidth: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>🔥 Popular</span>
                        <strong style={{ fontSize: '1.125rem', color: '#10b981' }}>{item.price}</strong>
                      </div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '8px 0 4px 0' }}>{item.name}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>By {item.dev}</span>
                      <button className="btn-icon primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }} onClick={() => alert(`Purchased ${item.name}!`)}>
                        🛒 Install Script
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: QUESTS & BADGES */}
          {activeTab === 'gamification' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 className="page-heading">Engagement Quests</h1>
                <p className="page-subheading">Complete OMEGA platform goals to unlock custom badges, badges, and discounts.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', alignItems: 'start' }}>
                <div className="card" style={{ maxWidth: '100%' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem' }}>Level 12 Automator</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' }}>
                    <div style={{ fontSize: '2.5rem' }}>🛡️</div>
                    <div style={{ flex: 1 }}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '68%' }} />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginTop: 4 }}>6,800 / 10,000 XP to next level</p>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ maxWidth: '100%' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Active Tasks</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      { name: 'Mass Linker', desc: 'Link 5 Facebook pages in a single workflow.', xp: '+250 XP', progress: '3/5 Done', percent: 60 },
                      { name: 'Publisher Pro', desc: 'Auto-publish 50 batch posts schedule.', xp: '+500 XP', progress: '50/50 Complete', percent: 100 },
                      { name: 'Uptime Keeper', desc: 'Maintain linked proxy automation for 7 days.', xp: '+400 XP', progress: '4/7 Days', percent: 57 },
                    ].map((quest, idx) => (
                      <div key={idx} style={{ padding: '10px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{quest.name}</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>{quest.xp}</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', marginBottom: 8 }}>{quest.desc}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-bar" style={{ flex: 1 }}>
                            <div className="progress-fill" style={{ width: `${quest.percent}%` }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>{quest.progress}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: GLOBAL SETTINGS */}
          {activeTab === 'settings' && (
            <div className="card" style={{ maxWidth: '640px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Global Security Settings</h2>
              <form onSubmit={(e) => { e.preventDefault(); alert('Global Settings Saved Successfully!'); }}>
                
                <div className="form-group">
                  <label className="form-label">Automation Proxy Address</label>
                  <input type="text" defaultValue="http://proxy-premium.omega.net:8800" className="form-input no-icon" />
                </div>

                <div className="form-group">
                  <label className="form-label">Encryption Key Secret</label>
                  <input type="password" defaultValue="••••••••••••••••••••" className="form-input no-icon" />
                </div>

                <div className="form-group">
                  <label className="form-label">Webhook URL Endpoints</label>
                  <input type="text" defaultValue="https://khmerghost.com/webhooks/social-events" className="form-input no-icon" />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    Enable auto IP rotating failover protocol
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    Dispatch Slack/Discord error reporting webhooks
                  </label>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>
                  💾 Save Configuration Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
