import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Simplified state to clearly handle the action links
  const [status, setStatus] = useState({ type: '', message: '', action: null });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '', action: null });

    try {
      // 1. COUNTERCHECK WITH SERVER: Does this user exist?
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles') // Ensure this matches your Supabase table (e.g., 'users' or 'profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError) console.warn("Check Error:", checkError);

      // 2. Logic Gates based on user mode
      if (isLoginMode && !existingUser) {
          setStatus({ 
              type: 'error', 
              message: 'Account not found.', 
              action: 'signup' // Flag to show the signup link
          });
          setLoading(false);
          return;
      }
      
      if (!isLoginMode && existingUser) {
          setStatus({ 
              type: 'error', 
              message: 'Account already exists.', 
              action: 'login' // Flag to show the login link
          });
          setLoading(false);
          return;
      }

      // 3. Proceed with Magic Link Auth
      const { error: authError } = await supabase.auth.signInWithOtp({ 
        email,
        options: { emailRedirectTo: window.location.origin }
      });

      if (authError) throw authError;

      // 4. Log Interaction
      await supabase.from('interactions').insert([
        { 
          user_id: email, 
          action_type: isLoginMode ? 'login_attempt' : 'signup_attempt',
          metadata: { source: 'React Frontend', mode: isLoginMode ? 'Login' : 'Signup' }
        }
      ]);

      setStatus({ 
        type: 'success', 
        message: `Success! Magic link sent to ${email}. Check your inbox.`,
        action: null
      });

    } catch (error) {
      console.error("Sync Error:", error.message);
      setStatus({ type: 'error', message: error.message, action: null });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isLoginMode ? 'Account Login' : 'Create Account'}</h2>
        <p style={styles.subtitle}>Cloud-to-Hardware Sync Active 📡</p>
        
        <form onSubmit={handleAuth} style={styles.form}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Processing...' : (isLoginMode ? 'Send Login Link' : 'Send Setup Link')}
          </button>
        </form>

        <div style={styles.toggleContainer}>
          <button 
            type="button" 
            onClick={() => { setIsLoginMode(!isLoginMode); setStatus({type: '', message: '', action: null}); }} 
            style={styles.toggleText}
          >
            {isLoginMode ? "Don't have an account? Sign Up" : "Already registered? Log In"}
          </button>
        </div>

        {/* Dynamic Alert Box with explicit link rendering */}
        {status.message && (
          <div style={{
            ...styles.alert,
            backgroundColor: status.type === 'error' ? '#2d1a1a' : '#1a2d1a',
            color: status.type === 'error' ? '#ff4d4d' : '#4BB543',
            border: `1px solid ${status.type === 'error' ? '#ff4d4d' : '#4BB543'}`
          }}>
            <span style={{ marginRight: '8px' }}>{status.message}</span>
            
            {/* Clickable Action Links */}
            {status.action === 'signup' && (
                <span 
                    onClick={() => { setIsLoginMode(false); setStatus({type: '', message: '', action: null}); }} 
                    style={styles.actionLink}
                >
                    Switch to Sign Up.
                </span>
            )}
            
            {status.action === 'login' && (
                <span 
                    onClick={() => { setIsLoginMode(true); setStatus({type: '', message: '', action: null}); }} 
                    style={styles.actionLink}
                >
                    Switch to Log In.
                </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' },
  card: { padding: '40px', borderRadius: '16px', backgroundColor: '#121212', color: '#ffffff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid #333' },
  title: { margin: '0 0 10px 0', fontSize: '26px', fontWeight: 'bold' },
  subtitle: { color: '#888', marginBottom: '25px', fontSize: '14px', letterSpacing: '1px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#1e1e1e', color: 'white', fontSize: '16px', outline: 'none' },
  button: { padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#e63946', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease' },
  toggleContainer: { marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' },
  toggleText: { background: 'none', border: 'none', color: '#888', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', cursor: 'pointer', fontWeight: 'bold' },
  alert: { marginTop: '20px', padding: '12px', borderRadius: '8px', fontSize: '14px', lineHeight: '1.4' },
  // Explicit styling for the clickable link inside the error box
  actionLink: { color: '#ffffff', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold' }
};

export default Login;