import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function TestAuth() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testPassword, setTestPassword] = useState('');

  // Create a test user with fixed credentials
  const createTestUser = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const email = testEmail || 'demo@careerAI.test';
      const password = testPassword || 'demo123456';
      
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Step 2: Create student profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert({
            id: authData.user.id,
            name: 'Demo User',
            email,
            college: 'Test College',
            degree: 'B.Tech',
            branch: 'Computer Science',
            year: '2nd Year',
            interests: ['Technology', 'AI'],
            career_goal: 'Software Engineer',
          });

        if (profileError) throw profileError;

        setMessage(`✅ Test account created!\n\nEmail: ${email}\nPassword: ${password}\n\nYou can now log in!`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>🧪 Test Auth Setup</h1>
      <p>Create a test account to bypass email rate limiting</p>

      <div style={{ marginBottom: '20px' }}>
        <label>Email (optional)</label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="demo@careerAI.test"
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>Password (optional)</label>
        <input
          type="password"
          value={testPassword}
          onChange={(e) => setTestPassword(e.target.value)}
          placeholder="demo123456"
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <button
        onClick={createTestUser}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {loading ? 'Creating...' : 'Create Test Account'}
      </button>

      {message && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: message.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: message.includes('✅') ? '#065f46' : '#991b1b',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace',
          }}
        >
          {message}
        </div>
      )}

      <p style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        After creating the account, visit <a href="/login">/login</a> to log in
      </p>
    </div>
  );
}
