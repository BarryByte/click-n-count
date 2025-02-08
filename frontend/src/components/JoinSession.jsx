import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const JoinSession = () => {
  const [sessionCode, setSessionCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    // Load recent sessions from localStorage
    const recent = JSON.parse(localStorage.getItem('recentSessions') || '[]');
    setRecentSessions(recent);
  }, []);

  const saveToRecentSessions = (code) => {
    const recent = JSON.parse(localStorage.getItem('recentSessions') || '[]');
    const updated = [code, ...recent.filter(s => s !== code)].slice(0, 3);
    localStorage.setItem('recentSessions', JSON.stringify(updated));
    setRecentSessions(updated);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:5000/session/${sessionCode}`);
      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        saveToRecentSessions(sessionCode);
        localStorage.setItem('sessionCode', sessionCode);
        
        // Simulate loading for better UX
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        setError(data.error || 'Failed to join session');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setSessionCode(value);
    if (error) setError('');
  };

  const joinRecentSession = (code) => {
    setSessionCode(code);
    handleJoin({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 opacity-20 animate-pulse" />
      
      <div className="relative w-full max-w-md p-6">
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-fuchsia-400 animate-pulse" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Join Session
            </h1>
          </div>

          {/* Main Form */}
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Enter Session Code
              </label>
              <input
                type="text"
                value={sessionCode}
                onChange={handleCodeInput}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-lg text-center tracking-wider font-mono focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20 transition-all duration-300"
                placeholder="000000"
                maxLength={6}
                disabled={loading || success}
              />
              <div className="text-center mt-2">
                <span className="text-sm text-gray-500">
                  {sessionCode.length}/6 digits
                </span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert className="bg-green-500/10 border-green-500/20 text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>Successfully joined! Redirecting...</AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success || sessionCode.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-fuchsia-500/25 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <>
                  Join Session
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Recent Sessions */}
          {recentSessions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h2 className="text-sm font-medium text-gray-400 mb-4">Recent Sessions</h2>
              <div className="space-y-2">
                {recentSessions.map((code) => (
                  <button
                    key={code}
                    onClick={() => joinRecentSession(code)}
                    className="w-full p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono">{code}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          <div className="mt-6 text-sm text-gray-500">
            <p>💡 Tips:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Check your session code carefully</li>
              <li>Session codes are 6 digits long</li>
              <li>Ask your host if you need help</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinSession;