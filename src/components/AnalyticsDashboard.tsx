import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, MousePointer, Calendar } from 'lucide-react';

interface AnalyticsData {
  data: any[];
  totalClicks: number;
  type: string;
}

export function AnalyticsDashboard() {
  const [dailyAnalytics, setDailyAnalytics] = useState<AnalyticsData | null>(null);
  const [weeklyAnalytics, setWeeklyAnalytics] = useState<AnalyticsData | null>(null);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<AnalyticsData | null>(null);
  const [topTools, setTopTools] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [daily, weekly, monthly, top] = await Promise.all([
          fetch('https://yzoonszpdhbbjrggekma.supabase.co/functions/v1/get-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ type: 'daily' })
          }),
          fetch('https://yzoonszpdhbbjrggekma.supabase.co/functions/v1/get-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ type: 'weekly' })
          }),
          fetch('https://yzoonszpdhbbjrggekma.supabase.co/functions/v1/get-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ type: 'monthly' })
          }),
          fetch('https://yzoonszpdhbbjrggekma.supabase.co/functions/v1/get-analytics', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ type: 'top-tools' })
          })
        ]);

        const [dailyData, weeklyData, monthlyData, topData] = await Promise.all([
          daily.json(),
          weekly.json(),
          monthly.json(),
          top.json()
        ]);

        setDailyAnalytics(dailyData);
        setWeeklyAnalytics(weeklyData);
        setMonthlyAnalytics(monthlyData);
        setTopTools(topData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-primary border-pixel p-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-pixel-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary font-mono">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-tertiary border-pixel p-6 hover-pixel">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded ${color}`}>
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{value.toLocaleString()}</p>
          <p className="text-sm text-secondary font-mono">{title}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary uppercase">Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-pixel-green" />
          <p className="text-sm font-mono text-secondary">Click Analytics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Today's Clicks"
          value={dailyAnalytics?.totalClicks || 0}
          icon={Calendar}
          color="bg-pixel-green"
        />
        <StatCard
          title="Weekly Clicks"
          value={weeklyAnalytics?.totalClicks || 0}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Monthly Clicks"
          value={monthlyAnalytics?.totalClicks || 0}
          icon={BarChart3}
          color="bg-purple-500"
        />
        <StatCard
          title="Best Tool"
          value={topTools?.data?.[0]?.click_count || 0}
          icon={MousePointer}
          color="bg-yellow-500"
        />
      </div>

      {/* Top Tools */}
      {topTools?.data && topTools.data.length > 0 && (
        <div className="bg-primary border-pixel p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-pixel-green" />
            <h3 className="text-xl font-bold text-primary uppercase">Most Clicked Tools</h3>
          </div>
          
          <div className="space-y-4">
            {topTools.data.slice(0, 10).map((item, index) => (
              <div key={item.tool_id} className="flex items-center justify-between p-4 bg-tertiary border-pixel hover-pixel">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-pixel-green text-black font-bold text-sm">
                    {index + 1}
                  </div>
                  <img
                    src={item.ai_tools?.logo_url || '/default-logo.png'}
                    alt={item.ai_tools?.name}
                    className="w-10 h-10 rounded border-pixel object-cover bg-white"
                    onError={(e) => {
                      e.currentTarget.src = '/default-logo.png';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-primary">{item.ai_tools?.name || 'Unknown Tool'}</h4>
                    <p className="text-sm text-secondary">
                      {item.ai_tools?.category || 'General'} • {item.ai_tools?.pricing || 'Free'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-pixel-green">{item.click_count}</p>
                  <p className="text-xs text-secondary">clicks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-primary border-pixel p-6">
        <div className="flex items-center gap-3 mb-6">
          <MousePointer className="w-6 h-6 text-pixel-green" />
          <h3 className="text-xl font-bold text-primary uppercase">Recent Activity</h3>
        </div>
        
        {dailyAnalytics?.data && dailyAnalytics.data.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {dailyAnalytics.data.slice(0, 20).map((item) => (
              <div key={`${item.tool_id}-${item.click_date}`} className="flex items-center justify-between p-2 bg-tertiary border-pixel">
                <div className="flex items-center gap-3">
                  <img
                    src={item.ai_tools?.logo_url || '/default-logo.png'}
                    alt={item.ai_tools?.name}
                    className="w-6 h-6 rounded border-pixel object-cover bg-white"
                    onError={(e) => {
                      e.currentTarget.src = '/default-logo.png';
                    }}
                  />
                  <span className="text-sm font-bold text-primary">{item.ai_tools?.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-secondary">
                  <span>{item.click_count} clicks</span>
                  <span>{item.click_date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MousePointer className="w-12 h-12 text-secondary mx-auto mb-4 opacity-50" />
            <p className="text-secondary font-mono">No activity data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}