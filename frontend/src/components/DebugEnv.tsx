import React from 'react';

const DebugEnv: React.FC = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '1rem', 
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px'
    }}>
      <h3>Environment Debug</h3>
      <p><strong>Supabase URL:</strong> {process.env.REACT_APP_SUPABASE_URL || 'NOT SET'}</p>
      <p><strong>Supabase Key:</strong> {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
      <p><strong>Node Env:</strong> {process.env.NODE_ENV}</p>
    </div>
  );
};

export default DebugEnv;