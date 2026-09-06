'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Heart, 
  Video, 
  TrendingUp, 
  RefreshCw, 
  Search, 
  ArrowUpRight, 
  BarChart2 
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Mock trend data used for visualization until historical data accumulates
const mockAnalyticsData = [
  { date: 'Day 1', followers: 12000, engagement: 840 },
  { date: 'Day 2', followers: 12350, engagement: 910 },
  { date: 'Day 3', followers: 12800, engagement: 1100 },
  { date: 'Day 4', followers: 13100, engagement: 1050 },
  { date: 'Day 5', followers: 13900, engagement: 1320 },
  { date: 'Day 6', followers: 14400, engagement: 1450 },
  { date: 'Day 7', followers: 15200, engagement: 1600 },
];

interface AccountStats {
  username: string;
  follower_count: number;
  heart_count: number;
  video_count: number;
  updated_at: string;
}

export default function DashboardPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<AccountStats | null>(null);

  const handleFetchData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tiktok/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch account metrics');
      }

      setAccount(data.account);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-blue-500" />
            TikTok Analytics & Performance
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track account growth, video performance, and engagement metrics in real-time.
          </p>
        </div>

        {/* TikTok Username Fetch Form */}
        <form onSubmit={handleFetchData} className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Enter TikTok username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-sm rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Fetching...
              </>
            ) : (
              'Sync Metrics'
            )}
          </button>
        </form>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-950/50 border border-red-800 text-red-300 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Followers */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Total Followers</span>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {account ? account.follower_count.toLocaleString() : '15,200'}
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.4% from last week</span>
          </div>
        </div>

        {/* Total Hearts / Likes */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Total Likes</span>
            <Heart className="w-5 h-5 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {account ? account.heart_count.toLocaleString() : '248,900'}
          </div>
          <div className="flex items-center gap-1 text-emerald-400 text-xs mt-3">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.1% from last week</span>
          </div>
        </div>

        {/* Total Videos */}
        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-sm font-medium">Published Videos</span>
            <Video className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white">
            {account ? account.video_count.toLocaleString() : '84'}
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-3">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>
              {account
                ? `Last updated ${new Date(account.updated_at).toLocaleTimeString()}`
                : 'Synced just now'}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Follower Growth Trend</h2>
            <p className="text-xs text-slate-400">Historical growth over the recent period</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Followers
            </span>
          </div>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAnalyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tickLine={false} fontSize={12} />
              <YAxis stroke="#64748b" tickLine={false} fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem', 
                  color: '#f8fafc' 
                }} 
              />
              <Area
                type="monotone"
                dataKey="followers"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFollowers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
