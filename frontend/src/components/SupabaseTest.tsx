import React, { useState } from 'react';
import { supabase } from '../config/supabase';

const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Simple test: Try to get the current session
      const { data, error } = await supabase.auth.getSession();
      console.log('Session test:', { data, error });
      
      if (error) {
        setTestResult(`❌ Session Error: ${error.message}`);
      } else {
        setTestResult('✅ Connection successful!');
      }

      // Test database connection
      const { data: dbData, error: dbError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      console.log('DB test:', { dbData, dbError });
      
      if (dbError) {
        setTestResult(prev => prev + `\n❌ DB Error: ${dbError.message}`);
      } else {
        setTestResult(prev => prev + '\n✅ Database accessible!');
      }
      
    } catch (error: any) {
      console.error('Connection test error:', error);
      setTestResult(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Supabase Connection Test</h4>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {testResult && (
        <pre style={{ 
          marginTop: '10px', 
          fontSize: '10px', 
          whiteSpace: 'pre-wrap',
          background: 'rgba(255,255,255,0.1)',
          padding: '8px',
          borderRadius: '4px'
        }}>
          {testResult}
        </pre>
      )}
    </div>
  );
};

export default SupabaseTest;