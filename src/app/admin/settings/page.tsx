'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, Plus, Trash2, Globe, CheckSquare, Send, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface Portal {
  label: string;
  href: string;
}

interface ChecklistItem {
  label: string;
  status: string;
  color: string;
}

interface TelegramConfig {
  title: string;
  description: string;
  channelUrl: string;
}

interface Config {
  alerts: string[];
  portals: Portal[];
  checklist: ChecklistItem[];
  telegram: TelegramConfig;
}

export default function SettingsPage() {
  const [config, setConfig] = useState<Config>({
    alerts: [],
    portals: [],
    checklist: [],
    telegram: { title: '', description: '', channelUrl: '' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/settings?key=homepage')
      .then((res) => (res.ok ? res.json() : null) as Promise<any>)
      .then((data) => {
        if (data && data.value) {
          setConfig({
            alerts: data.value.alerts || [],
            portals: data.value.portals || [],
            checklist: data.value.checklist || [],
            telegram: data.value.telegram || { title: '', description: '', channelUrl: '' }
          });
        }
      })
      .catch(() => setError('Failed to fetch homepage configurations'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/settings?key=homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: config })
      });
      if (res.ok) {
        setSuccess('Homepage configuration updated successfully!');
      } else {
        const errData = await res.json() as any;
        setError(errData.error || 'Failed to save settings.');
      }
    } catch {
      setError('Network error: Failed to reach the API server.');
    } finally {
      setSaving(false);
    }
  };

  // Alerts Management
  const addAlert = () => {
    setConfig(prev => ({ ...prev, alerts: [...prev.alerts, 'New announcement alert...'] }));
  };
  const removeAlert = (idx: number) => {
    setConfig(prev => ({ ...prev, alerts: prev.alerts.filter((_, i) => i !== idx) }));
  };
  const updateAlert = (idx: number, val: string) => {
    setConfig(prev => ({
      ...prev,
      alerts: prev.alerts.map((item, i) => (i === idx ? val : item))
    }));
  };

  // Portals Management
  const addPortal = () => {
    setConfig(prev => ({
      ...prev,
      portals: [...prev.portals, { label: 'Portal Name', href: 'https://' }]
    }));
  };
  const removePortal = (idx: number) => {
    setConfig(prev => ({ ...prev, portals: prev.portals.filter((_, i) => i !== idx) }));
  };
  const updatePortal = (idx: number, field: keyof Portal, val: string) => {
    setConfig(prev => ({
      ...prev,
      portals: prev.portals.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    }));
  };

  // Checklist Management
  const addChecklist = () => {
    setConfig(prev => ({
      ...prev,
      checklist: [...prev.checklist, { label: 'Task Name', status: 'Awaiting Link', color: '#d33' }]
    }));
  };
  const removeChecklist = (idx: number) => {
    setConfig(prev => ({ ...prev, checklist: prev.checklist.filter((_, i) => i !== idx) }));
  };
  const updateChecklist = (idx: number, field: keyof ChecklistItem, val: string) => {
    setConfig(prev => ({
      ...prev,
      checklist: prev.checklist.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    }));
  };

  // Telegram Config Management
  const updateTelegram = (field: keyof TelegramConfig, val: string) => {
    setConfig(prev => ({
      ...prev,
      telegram: { ...prev.telegram, [field]: val }
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', color: 'var(--text-muted)' }}>
        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <p>Loading homepage configurations...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Homepage Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Configure widgets, checklists, news tickers, and external links.</p>
        </div>
        
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Notifications banner */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '1rem', color: '#b91c1c', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', borderRadius: '8px', padding: '1rem', color: '#065f46', display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          <CheckSquare size={18} style={{ flexShrink: 0 }} />
          <span>{success}</span>
        </div>
      )}

      {/* Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* SECTION 1: News Alerts (Marquee Ticker) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ color: '#dc2626' }} /> Breaking News Ticker
            </h3>
            <button onClick={addAlert} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Plus size={14} /> Add Alert
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {config.alerts.map((alert, idx) => (
              <div key={`alert-${idx}`} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={alert} 
                  onChange={(e) => updateAlert(idx, e.target.value)} 
                  placeholder="Enter flash announcement text..."
                />
                <button 
                  onClick={() => removeAlert(idx)} 
                  className="btn btn-danger" 
                  style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Alert"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {config.alerts.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No manual ticker items. Ticker will query latest announcements automatically.</p>
            )}
          </div>
        </div>

        {/* SECTION 2: Important Portals (Sidebar Quick Links) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={18} style={{ color: 'var(--accent)' }} /> Important Portals Links
            </h3>
            <button onClick={addPortal} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Plus size={14} /> Add Link
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {config.portals.map((portal, idx) => (
              <div key={`portal-${idx}`} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={portal.label} 
                  onChange={(e) => updatePortal(idx, 'label', e.target.value)} 
                  placeholder="Link Label (e.g. IGNOU Web)"
                />
                <input 
                  type="text" 
                  className="form-input" 
                  value={portal.href} 
                  onChange={(e) => updatePortal(idx, 'href', e.target.value)} 
                  placeholder="https://..."
                />
                <button 
                  onClick={() => removePortal(idx)} 
                  className="btn btn-danger" 
                  style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {config.portals.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No portal links added yet.</p>
            )}
          </div>
        </div>

        {/* SECTION 3: Action Checklist (Announcements Status) */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckSquare size={18} style={{ color: '#ea580c' }} /> Action Checklist Statuses
            </h3>
            <button onClick={addChecklist} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Plus size={14} /> Add Checklist Item
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {config.checklist.map((item, idx) => (
              <div key={`checklist-${idx}`} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={item.label} 
                  onChange={(e) => updateChecklist(idx, 'label', e.target.value)} 
                  placeholder="e.g. Exam Hall Ticket"
                />
                <input 
                  type="text" 
                  className="form-input" 
                  value={item.status} 
                  onChange={(e) => updateChecklist(idx, 'status', e.target.value)} 
                  placeholder="e.g. Open / Active"
                />
                <select 
                  className="form-select"
                  value={item.color}
                  onChange={(e) => updateChecklist(idx, 'color', e.target.value)}
                >
                  <option value="#16a34a">Green (Active)</option>
                  <option value="#2563eb">Blue (Info)</option>
                  <option value="#b45309">Orange (Warning)</option>
                  <option value="#d33">Red (Alert)</option>
                </select>
                <button 
                  onClick={() => removeChecklist(idx)} 
                  className="btn btn-danger" 
                  style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {config.checklist.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No checklist items defined yet.</p>
            )}
          </div>
        </div>

        {/* SECTION 4: Telegram Community Link */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={18} style={{ color: '#2563eb' }} /> Telegram Channel Widget
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Widget Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.telegram.title} 
                onChange={(e) => updateTelegram('title', e.target.value)} 
                placeholder="Join Telegram Channel"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Widget Description</label>
              <textarea 
                className="form-textarea" 
                value={config.telegram.description} 
                onChange={(e) => updateTelegram('description', e.target.value)} 
                placeholder="Enter inviting description text..."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Telegram Link URL</label>
              <input 
                type="text" 
                className="form-input" 
                value={config.telegram.channelUrl} 
                onChange={(e) => updateTelegram('channelUrl', e.target.value)} 
                placeholder="https://t.me/your_channel"
              />
            </div>
          </div>
        </div>

      </div>
      
      {/* Save Button Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn btn-primary btn-lg"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Saving Homepage settings...' : 'Save All Settings'}
        </button>
      </div>

    </div>
  );
}
