import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import AnalyticsService, { 
  LeadSourceData, 
  ConversionRateBySource, 
  TimeToConvertData, 
  TeamPerformanceData, 
  ConversionFunnelData,
  LeadSourcesOverTimeData,
  LeadQualityData,
  SourceEffectivenessData,
  ResponseTimeData,
  DealSizeData,
  GrowthMetrics,
  AvgDealSizeData
} from '@/services/analytics.service';

const Analytics: React.FC = () => {
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for analytics data
  const [timeframe, setTimeframe] = useState<string>('30days');
  const [leadStats, setLeadStats] = useState<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    proposal: number;
    negotiation: number;
    won: number;
    lost: number;
  }>({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    won: 0,
    lost: 0
  });
  
  const [leadGrowthData, setLeadGrowthData] = useState<{name: string; leads: number; converted: number}[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<{name: string; value: number; color: string}[]>([]);
  const [sourceData, setSourceData] = useState<LeadSourceData[]>([]);
  const [conversionFunnelData, setConversionFunnelData] = useState<ConversionFunnelData[]>([]);
  const [conversionRatesBySource, setConversionRatesBySource] = useState<ConversionRateBySource[]>([]);
  const [timeToConvertData, setTimeToConvertData] = useState<TimeToConvertData[]>([]);
  const [teamPerformanceData, setTeamPerformanceData] = useState<TeamPerformanceData[]>([]);
  const [leadSourcesOverTime, setLeadSourcesOverTime] = useState<LeadSourcesOverTimeData[]>([]);
  const [leadQualityBySource, setLeadQualityBySource] = useState<LeadQualityData[]>([]);
  const [sourceEffectiveness, setSourceEffectiveness] = useState<SourceEffectivenessData[]>([]);
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeData[]>([]);
  const [dealSizeData, setDealSizeData] = useState<DealSizeData[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics>({
    leadGrowthRate: 0,
    conversionGrowthRate: 0,
    pipelineGrowthRate: 0,
    dealSizeGrowthRate: 0
  });
  const [avgDealSize, setAvgDealSize] = useState<AvgDealSizeData>({
    value: 0,
    change: 0
  });
  
  // Fetch all analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch dashboard stats which includes lead stats and status distribution
        const dashboardStats = await AnalyticsService.getDashboardStats();
        
        // Extract lead stats from dashboard data
        const totalLeads = dashboardStats.totalLeads || 0;
        const statusCounts = dashboardStats.statusDistribution.reduce((acc, item) => {
          acc[item.name.toLowerCase()] = item.value;
          return acc;
        }, {} as Record<string, number>);
        
        setLeadStats({
          total: totalLeads,
          new: statusCounts.new || 0,
          contacted: statusCounts.contacted || 0,
          qualified: statusCounts.qualified || 0,
          proposal: statusCounts.proposal || 0,
          negotiation: statusCounts.negotiation || 0,
          won: statusCounts.won || 0,
          lost: statusCounts.lost || 0
        });
        
        // Set status distribution
        setStatusDistribution(dashboardStats.statusDistribution);
        
        // Set lead growth data
        const growthData = dashboardStats.leadGrowth.map(item => ({
          name: item.name,
          leads: item.leads,
          converted: Math.round(item.leads * (dashboardStats.conversionRate / 100))
        }));
        setLeadGrowthData(growthData);
        
        // Fetch lead sources
        const sources = await AnalyticsService.getLeadSources();
        setSourceData(sources);
        
        // Fetch conversion funnel data
        const funnelData = await AnalyticsService.getConversionFunnel();
        setConversionFunnelData(funnelData);
        
        // Fetch conversion rates by source
        const conversionRates = await AnalyticsService.getConversionRatesBySource();
        setConversionRatesBySource(conversionRates);
        
        // Fetch time to convert data
        const timeToConvert = await AnalyticsService.getTimeToConvert();
        setTimeToConvertData(timeToConvert);
        
        // Fetch team performance data
        const teamPerformance = await AnalyticsService.getTeamPerformance();
        setTeamPerformanceData(teamPerformance);
        
        // Fetch lead sources over time data
        const sourcesOverTime = await AnalyticsService.getLeadSourcesOverTime();
        setLeadSourcesOverTime(sourcesOverTime);
        
        // Fetch lead quality by source data
        const qualityBySource = await AnalyticsService.getLeadQualityBySource();
        setLeadQualityBySource(qualityBySource);
        
        // Fetch source effectiveness data
        const effectiveness = await AnalyticsService.getSourceEffectiveness();
        setSourceEffectiveness(effectiveness);
        
        // Fetch response time data
        const responseTime = await AnalyticsService.getResponseTime();
        setResponseTimeData(responseTime);
        
        // Fetch deal size data
        const dealSize = await AnalyticsService.getDealSize();
        setDealSizeData(dealSize);
        
        // Fetch growth metrics
        const metrics = await AnalyticsService.getGrowthMetrics();
        setGrowthMetrics(metrics);
        
        // Fetch average deal size
        const avgDeal = await AnalyticsService.getAvgDealSize();
        setAvgDealSize(avgDeal);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [timeframe]);
  
  // Color palette for charts
  const COLORS = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#D97706', '#10B981', '#EF4444'];
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Track your lead generation and conversion metrics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {growthMetrics.leadGrowthRate > 0 ? '+' : ''}{growthMetrics.leadGrowthRate}% from previous month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((leadStats.won / leadStats.total) * 100)}%</div>
              <p className="text-xs text-muted-foreground">
                {growthMetrics.conversionGrowthRate > 0 ? '+' : ''}{growthMetrics.conversionGrowthRate}% from last quarter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leadStats.contacted + leadStats.qualified + leadStats.proposal + leadStats.negotiation}</div>
              <p className="text-xs text-muted-foreground">
                {growthMetrics.pipelineGrowthRate > 0 ? '+' : ''}{growthMetrics.pipelineGrowthRate}% from previous month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${avgDealSize.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {avgDealSize.change > 0 ? '+' : ''}{avgDealSize.change}% from previous month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
              <TabsTrigger value="sources">Sources</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center space-x-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="12months">Last 12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="overview" className="pt-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Lead Growth</CardTitle>
                  <CardDescription>Month over month lead generation and conversions</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={leadGrowthData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                      <YAxis fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="leads"
                        name="Total Leads"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="converted"
                        name="Converted Leads"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} leads`, name]}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sourceData}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" fontSize={12} tickMargin={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      />
                      <Bar dataKey="value" name="Leads" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="conversion" className="pt-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Funnel</CardTitle>
                  <CardDescription>Leads progression through sales stages</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={conversionFunnelData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                        }}
                      />
                      <Bar dataKey="value" name="Leads" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                        {conversionFunnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
                
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate by Source</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={conversionRatesBySource}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `${value}%`} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, 'Conversion Rate']}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Bar dataKey="rate" name="Conversion Rate" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Time to Convert</CardTitle>
                  <CardDescription>Average days from lead creation to conversion</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={timeToConvertData.map((item) => ({ month: item.month, days: item.days }))}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} days`, 'Avg. Time to Convert']}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="days" 
                        stroke="#EC4899" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="pt-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Lead Sources Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={leadSourcesOverTime}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Legend />
                      {sourceData.map((source, index) => {
                        const sourceKey = source.name.toLowerCase().replace(/\s+/g, '_');
                        return (
                          <Bar 
                            key={sourceKey}
                            dataKey={sourceKey} 
                            name={source.name} 
                            stackId="a" 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lead Quality by Source</CardTitle>
                  <CardDescription>Average lead score (0-100)</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={leadQualityBySource}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => [`${value}/100`, 'Quality Score']}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Bar dataKey="score" name="Quality Score" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cost per Lead by Source</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sourceEffectiveness}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#F59E0B" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Legend />
                      <Bar yAxisId="left" dataKey="costPerLead" name="Cost per Lead ($)" fill="#3B82F6" />
                      <Bar yAxisId="right" dataKey="roi" name="ROI" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="pt-4">
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Lead generation and conversion by team member</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={teamPerformanceData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="leads" name="Total Leads" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="won" name="Won Deals" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Response Time</CardTitle>
                  <CardDescription>Average hours to first lead contact</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={responseTimeData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`${value} hours`, 'Response Time']}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Bar dataKey="hours" name="Response Time (hours)" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Deal Size by Rep</CardTitle>
                  <CardDescription>Average deal value in dollars</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dealSizeData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [`$${value.toLocaleString()}`, 'Avg. Deal Size']}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Bar dataKey="value" name="Deal Size" fill="#EC4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
