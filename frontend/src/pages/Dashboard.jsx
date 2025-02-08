import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Sparkles, Trophy, Users, Activity, 
  LineChart, Timer, Plus, X 
} from 'lucide-react';

const Dashboard = () => {
  const [session, setSession] = useState(null);
  const [stats, setStats] = useState(null);
  const [polls, setPolls] = useState([]);
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const sessionCode = localStorage.getItem('sessionCode');
    if (sessionCode) {
      connectWebSocket(sessionCode);
      fetchSessionData(sessionCode);
      fetchStats(sessionCode);
      fetchPolls(sessionCode);
    }
  }, []);

  const connectWebSocket = (sessionCode) => {
    const ws = new WebSocket('ws://localhost:5000');
    ws.onopen = () => {
      ws.send(JSON.stringify({ event: 'joinSession', data: sessionCode }));
    };
    ws.onmessage = (event) => {
      const { event: wsEvent, data } = JSON.parse(event.data);
      handleWebSocketEvent(wsEvent, data);
    };
    setWs(ws);
  };

  const handleWebSocketEvent = (event, data) => {
    switch (event) {
      case 'updateResults':
        updatePollResults(data);
        break;
      case 'newPoll':
        setPolls(prev => [...prev, data]);
        break;
      case 'pollEnded':
        updatePollStatus(data);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-500 to-orange-500 opacity-20 animate-pulse" />
      
      <div className="relative">
        {/* Header */}
        <header className="p-6 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-fuchsia-400" />
              <h1 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Poll Dashboard
              </h1>
            </div>
            <button
              onClick={() => setShowNewPollModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-fuchsia-500/25 transition duration-300"
            >
              <Plus className="w-5 h-5" />
              New Poll
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats && [
              {
                label: "Total Polls",
                value: stats.totalPolls,
                icon: Trophy,
                color: "text-yellow-400"
              },
              {
                label: "Total Votes",
                value: stats.totalVotes,
                icon: Users,
                color: "text-green-400"
              },
              {
                label: "Active Polls",
                value: stats.activePolls,
                icon: Activity,
                color: "text-blue-400"
              },
              {
                label: "Completed",
                value: stats.completedPolls,
                icon: Timer,
                color: "text-purple-400"
              }
            ].map((stat, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
                <h3 className="text-gray-400 text-sm">{stat.label}</h3>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Active Polls */}
          <div className="space-y-6">
            {polls.map(poll => (
              <PollCard key={poll._id} poll={poll} ws={ws} />
            ))}
          </div>
        </main>
      </div>

      {/* New Poll Modal */}
      {showNewPollModal && (
        <NewPollModal onClose={() => setShowNewPollModal(false)} />
      )}
    </div>
  );
};

const PollCard = ({ poll, ws }) => {
  const data = Object.entries(poll.results).map(([label, value]) => ({
    name: label,
    votes: value
  }));

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold mb-2">{poll.question}</h3>
          <p className="text-gray-400">
            {Object.values(poll.results).reduce((a, b) => a + b, 0)} total votes
          </p>
        </div>
        {poll.isActive && (
          <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
            End Poll
          </button>
        )}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis dataKey="name" stroke="#ffffff80" />
            <YAxis stroke="#ffffff80" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff10', 
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px'
              }}
            />
            <Bar dataKey="votes" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const NewPollModal = ({ onClose }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implementation for creating new poll
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Poll</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-400 hover:text-white transition" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
              placeholder="What's your question?"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-400">
              Options
            </label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white"
                placeholder={`Option ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-fuchsia-500/25 transition duration-300"
          >
            Create Poll
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;