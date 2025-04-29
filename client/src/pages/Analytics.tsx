
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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

import { mockLeads, calculateLeadStats } from '@/data/mockLeads';

const Analytics: React.FC = () => {
  const leadStats = calculateLeadStats(mockLeads);
  
  // Mock data for line charts
  const leadProgressData = [
    { name: 'Jan', leads: 20, converted: 5 },
    { name: 'Feb', leads: 40, converted: 10 },
    { name: 'Mar', leads: 30, converted: 12 },
    { name: 'Apr', leads: 70, converted: 25 },
    { name: 'May', leads: 50, converted: 18 },
    { name: 'Jun', leads: 90, converted: 30 },
    { name: 'Jul', leads: 120, converted: 45 },
  ];

  // Data for pie chart
  const statusData = [
    { name: 'New', value: leadStats.new, color: '#3B82F6' },
    { name: 'Contacted', value: leadStats.contacted, color: '#8B5CF6' },
    { name: 'Qualified', value: leadStats.qualified, color: '#F59E0B' },
    { name: 'Proposal', value: leadStats.proposal, color: '#EC4899' },
    { name: 'Negotiation', value: leadStats.negotiation, color: '#D97706' },
    { name: 'Won', value: leadStats.won, color: '#10B981' },
    { name: 'Lost', value: leadStats.lost, color: '#EF4444' },
  ];
  
  // Source data for bar chart
  const sourceData = [
    { name: 'Website', value: 45 },
    { name: 'Referral', value: 28 },
    { name: 'Social', value: 18 },
    { name: 'Email', value: 15 },
    { name: 'Events', value: 12 },
    { name: 'Other', value: 8 },
  ];
  
  // Conversion data for funnel chart
  const conversionFunnelData = [
    { name: 'New Leads', value: leadStats.new + leadStats.contacted + leadStats.qualified + leadStats.proposal + leadStats.negotiation + leadStats.won + leadStats.lost },
    { name: 'Contacted', value: leadStats.contacted + leadStats.qualified + leadStats.proposal + leadStats.negotiation + leadStats.won + leadStats.lost },
    { name: 'Qualified', value: leadStats.qualified + leadStats.proposal + leadStats.negotiation + leadStats.won + leadStats.lost },
    { name: 'Proposal', value: leadStats.proposal + leadStats.negotiation + leadStats.won + leadStats.lost },
    { name: 'Negotiation', value: leadStats.negotiation + leadStats.won + leadStats.lost },
    { name: 'Won', value: leadStats.won },
  ];
  
  // Activity heatmap data (mock data)
  const activityData = [
    { date: '2023-04-01', value: 5 },
    { date: '2023-04-02', value: 3 },
    { date: '2023-04-03', value: 7 },
    { date: '2023-04-04', value: 2 },
    { date: '2023-04-05', value: 8 },
    { date: '2023-04-06', value: 4 },
    { date: '2023-04-07', value: 1 },
  ];
  
  // Performance by team member
  const teamPerformanceData = [
    { name: 'Alice', leads: 45, won: 15 },
    { name: 'Bob', leads: 30, won: 8 },
    { name: 'Charlie', leads: 25, won: 10 },
    { name: 'Diana', leads: 20, won: 12 },
  ];
  
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
                +12% from previous month
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
                +2.5% from last quarter
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
                8 new leads this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,492</div>
              <p className="text-xs text-muted-foreground">
                -5% from previous month
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
                      data={leadProgressData}
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
                        data={statusData}
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
                        {statusData.map((entry, index) => (
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
                      data={[
                        { name: 'Website', rate: 18 },
                        { name: 'Referral', rate: 32 },
                        { name: 'Social', rate: 15 },
                        { name: 'Email', rate: 22 },
                        { name: 'Events', rate: 28 }
                      ]}
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
                      data={[
                        { month: 'Jan', days: 45 },
                        { month: 'Feb', days: 42 },
                        { month: 'Mar', days: 38 },
                        { month: 'Apr', days: 35 },
                        { month: 'May', days: 30 },
                        { month: 'Jun', days: 28 },
                        { month: 'Jul', days: 25 }
                      ]}
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
                        name="Days to Convert" 
                        stroke="#EC4899" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
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
                      data={[
                        { name: 'Jan', website: 20, referral: 15, social: 8, email: 12, events: 5 },
                        { name: 'Feb', website: 25, referral: 18, social: 12, email: 15, events: 8 },
                        { name: 'Mar', website: 18, referral: 20, social: 15, email: 10, events: 7 },
                        { name: 'Apr', website: 22, referral: 25, social: 18, email: 14, events: 12 },
                        { name: 'May', website: 30, referral: 22, social: 20, email: 16, events: 10 },
                        { name: 'Jun', website: 35, referral: 28, social: 22, email: 18, events: 15 },
                      ]}
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
                      <Bar dataKey="website" name="Website" stackId="a" fill="#3B82F6" />
                      <Bar dataKey="referral" name="Referral" stackId="a" fill="#8B5CF6" />
                      <Bar dataKey="social" name="Social" stackId="a" fill="#F59E0B" />
                      <Bar dataKey="email" name="Email" stackId="a" fill="#10B981" />
                      <Bar dataKey="events" name="Events" stackId="a" fill="#EC4899" />
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
                      data={[
                        { name: 'Website', score: 65 },
                        { name: 'Referral', score: 85 },
                        { name: 'Social', score: 55 },
                        { name: 'Email', score: 70 },
                        { name: 'Events', score: 78 }
                      ]}
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
                      data={[
                        { name: 'Website', cost: 45 },
                        { name: 'Referral', cost: 15 },
                        { name: 'Social', cost: 65 },
                        { name: 'Email', cost: 30 },
                        { name: 'Events', cost: 85 }
                      ]}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Cost per Lead']}
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "0.5rem",
                          border: "1px solid #e2e8f0"
                        }}
                      />
                      <Bar dataKey="cost" name="Cost per Lead" fill="#F59E0B" radius={[4, 4, 0, 0]} />
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
                      data={[
                        { name: 'Alice', hours: 1.5 },
                        { name: 'Bob', hours: 3.2 },
                        { name: 'Charlie', hours: 2.1 },
                        { name: 'Diana', hours: 1.8 }
                      ]}
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
                      data={[
                        { name: 'Alice', value: 12500 },
                        { name: 'Bob', value: 9800 },
                        { name: 'Charlie', value: 15200 },
                        { name: 'Diana', value: 11000 }
                      ]}
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
