import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Target,
  Zap,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { mockStats } from "../services/mockData";

const StatsCard = ({ title, value, change, changeType, icon: Icon, description }) => (
  <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg mb-2">
            <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-xs ${
              changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {changeType === 'increase' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

const CategoryChart = ({ data }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 
    'bg-green-500', 'bg-blue-500', 'bg-purple-500'
  ];

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([category, count], index) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={category} className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                {category.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm font-mono text-slate-600 dark:text-slate-400 min-w-12">
                {count}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TrendChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.approved + d.flagged + d.review));
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="text-slate-600 dark:text-slate-400">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span className="text-slate-600 dark:text-slate-400">Flagged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
          <span className="text-slate-600 dark:text-slate-400">Review</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((day, index) => {
          const total = day.approved + day.flagged + day.review;
          const approvedHeight = maxValue > 0 ? (day.approved / maxValue) * 100 : 0;
          const flaggedHeight = maxValue > 0 ? (day.flagged / maxValue) * 100 : 0;
          const reviewHeight = maxValue > 0 ? (day.review / maxValue) * 100 : 0;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-40 relative">
                <div className="w-full flex flex-col justify-end h-full gap-0.5">
                  {day.review > 0 && (
                    <div 
                      className="w-full bg-yellow-500 rounded-t-sm transition-all duration-500"
                      style={{ height: `${reviewHeight}%` }}
                    />
                  )}
                  {day.flagged > 0 && (
                    <div 
                      className={`w-full bg-red-500 transition-all duration-500 ${day.review === 0 ? 'rounded-t-sm' : ''}`}
                      style={{ height: `${flaggedHeight}%` }}
                    />
                  )}
                  {day.approved > 0 && (
                    <div 
                      className={`w-full bg-green-500 transition-all duration-500 ${day.flagged === 0 && day.review === 0 ? 'rounded-t-sm' : ''}`}
                      style={{ height: `${approvedHeight}%` }}
                    />
                  )}
                </div>
                <div className="absolute -bottom-6 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {total}
                </div>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
                {new Date(day.date).toLocaleDateString([], { weekday: 'short' })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StatsOverview = () => {
  const [stats, setStats] = useState(mockStats);
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update some random values to show refresh
    setStats(prev => ({
      ...prev,
      todayProcessed: prev.todayProcessed + Math.floor(Math.random() * 10),
      accuracy: Math.round((prev.accuracy + (Math.random() - 0.5) * 2) * 10) / 10
    }));
    
    setIsRefreshing(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Statistics Overview</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitor your content moderation performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Moderated"
          value={stats.totalModerated.toLocaleString()}
          change="+12.5%"
          changeType="increase"
          icon={BarChart3}
          description="All time"
        />
        <StatsCard
          title="Approved"
          value={stats.approvedCount.toLocaleString()}
          change="+8.2%"
          changeType="increase"
          icon={CheckCircle}
          description={`${Math.round((stats.approvedCount / stats.totalModerated) * 100)}% of total`}
        />
        <StatsCard
          title="Flagged"
          value={stats.flaggedCount.toLocaleString()}
          change="-3.1%"
          changeType="decrease"
          icon={XCircle}
          description={`${Math.round((stats.flaggedCount / stats.totalModerated) * 100)}% of total`}
        />
        <StatsCard
          title="Needs Review"
          value={stats.reviewCount.toLocaleString()}
          change="+5.7%"
          changeType="increase"
          icon={AlertTriangle}
          description={`${Math.round((stats.reviewCount / stats.totalModerated) * 100)}% of total`}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Today's Processing"
          value={stats.todayProcessed}
          icon={Clock}
          description="Items processed today"
        />
        <StatsCard
          title="Accuracy Rate"
          value={`${stats.accuracy}%`}
          change="+0.3%"
          changeType="increase"
          icon={Target}
          description="Model accuracy"
        />
        <StatsCard
          title="Avg Processing Time"
          value={`${stats.avgProcessingTime}s`}
          change="-0.1s"
          changeType="decrease"
          icon={Zap}
          description="Per item"
        />
        <StatsCard
          title="Active Categories"
          value="6"
          icon={BarChart3}
          description="Moderation categories"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Daily Trends
            </CardTitle>
            <CardDescription>Moderation activity over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChart data={stats.dailyTrends} />
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Category Breakdown
            </CardTitle>
            <CardDescription>Flagged content by category</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryChart data={stats.categoryBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retrain Model
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Target className="w-4 h-4 mr-2" />
              Adjust Thresholds
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">API Response Time</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Excellent
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Model Performance</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Optimal
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 dark:text-slate-400">Queue Status</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                Low Load
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-300">High Flagged Rate</p>
                <p className="text-xs text-red-600 dark:text-red-400">15% increase in flagged content</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Review Queue</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">500 items pending review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatsOverview;