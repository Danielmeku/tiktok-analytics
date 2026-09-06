'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function AnalyticsDashboard() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  // Fetch historic analytics from Supabase
  const loadAnalytics = async () => {
    const { data } = await supabase
      .from('tiktok_analytics')
      .select('*')
      .order('fetched_at', { ascending: true });

    if (data) {
      const formatted = data.map((item) => ({
        ...item,
        date: new Date(item.fetched_at).toLocaleDateString(),
      }));
      setAnalyticsData(formatted);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch('/api/fetch-tiktok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    setLoading(false);
    setUsername('');
    loadAnalytics(); // Refresh chart with new snapshot
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">TikTok Creator Analytics</h1>

      {/* Input Form */}
      <form onSubmit={handleFetch} className="flex gap-4">
        <input
          type="text"
          placeholder="Enter TikTok Username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded flex-1 dark:bg-gray-800"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Fetching...' : 'Track Profile'}
        </button>
      </form>

      {/* Recharts Analytics Visualization */}
      <div className="p-6 bg-white dark:bg-gray-900 shadow rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Follower & Engagement Trends</h2>
        {analyticsData.length === 0 ? (
          <p className="text-gray-500">No tracked data available yet. Fetch a profile above.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="followers_count"
                  stroke="#2563eb"
                  name="Followers"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="engagement_rate"
                  stroke="#16a34a"
                  name="Engagement Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
