import React, { useState } from 'react';
import { supabase } from '../config/supabase';

const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing...');
    
    try {
      // Test 1: Basic auth session (doesn't require DB access)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log('Session test:', { sessionData, sessionError });
      
      if (sessionError) {
        setTestResult(`❌ Auth Error: ${sessionError.message}`);
        return;
      } else {
        setTestResult('✅ Auth service accessible!');
      }

      // Test 2: Simple RPC call (bypasses RLS)
      const { data: rpcData, error: rpcError } = await supabase.rpc('test_connection');
      console.log('RPC test:', { rpcData, rpcError });
      
      if (rpcError) {
        setTestResult(prev => prev + `\n❌ RPC Error: ${rpcError.message}`);
      } else {
        setTestResult(prev => prev + '\n✅ Database RPC working!');
      }

      // Test 3: Public table access (if RLS is disabled)
      const { data: dbData, error: dbError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      console.log('DB test:', { dbData, dbError });
      
      if (dbError) {
        setTestResult(prev => prev + `\n❌ DB Access: ${dbError.message}`);
        setTestResult(prev => prev + '\n💡 Try disabling RLS policies');
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