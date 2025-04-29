
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Cell
} from 'recharts';
import { mockLeads, calculateLeadStats } from '@/data/mockLeads';

const Dashboard: React.FC = () => {
  const leadStats = calculateLeadStats(mockLeads);
  
  // Mock data for the line chart
  const leadProgressData = [
    { name: 'Jan', leads: 20 },
    { name: 'Feb', leads: 40 },
    { name: 'Mar', leads: 30 },
    { name: 'Apr', leads: 70 },
    { name: 'May', leads: 50 },
    { name: 'Jun', leads: 90 },
    { name: 'Jul', leads: 120 },
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

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your lead management overview and statistics.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Leads"
            value={leadStats.total}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            trend={{ value: 12, isPositive: true }}
            description="vs. previous month"
          />
          <StatsCard
            title="Active Pipeline"
            value={leadStats.contacted + leadStats.qualified + leadStats.proposal + leadStats.negotiation}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            }
            trend={{ value: 8, isPositive: true }}
            description="increased this week"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${Math.round((leadStats.won / leadStats.total) * 100)}%`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            trend={{ value: 2.5, isPositive: true }}
            description="vs. last quarter"
          />
          <StatsCard
            title="Avg. Deal Size"
            value="$8,492"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            }
            trend={{ value: 5, isPositive: false }}
            description="slight decrease"
          />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Lead Growth</CardTitle>
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
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="#3B82F6"
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
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock activity feed */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">New lead created</p>
                    <p className="text-sm text-muted-foreground">Michael Johnson from Acme Inc.</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Lead status updated</p>
                    <p className="text-sm text-muted-foreground">Sarah Smith moved to Qualified</p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 rounded-full p-2 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Note added</p>
                    <p className="text-sm text-muted-foreground">David Williams requested a follow-up call</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeads
                  .filter(lead => lead.status === 'proposal' || lead.status === 'negotiation')
                  .sort((a, b) => (b.value || 0) - (a.value || 0))
                  .slice(0, 3)
                  .map((lead, index) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white rounded-full h-10 w-10 flex items-center justify-center border">
                          <span className="text-sm font-semibold text-gray-700">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${lead.value?.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
