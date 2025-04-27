
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Ticket, DollarSign, Users, TrendingUp, Calendar, Clock, MapPin, Percent } from 'lucide-react';
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as UiCalendar } from "@/components/ui/calendar"; // Rename Calendar import
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// --- Placeholder Data for Charts (More complex examples) ---
const detailedRevenueData = [
  { date: '2024-07-01', revenue: 200, show: 'Show A' }, { date: '2024-07-01', revenue: 150, show: 'Show B' },
  { date: '2024-07-02', revenue: 250, show: 'Show A' }, { date: '2024-07-02', revenue: 100, show: 'Show C' },
  { date: '2024-07-03', revenue: 300, show: 'Show B' }, { date: '2024-07-04', revenue: 220, show: 'Show A' },
  // ... more data points
  { date: '2024-07-15', revenue: 400, show: 'Show A' }, { date: '2024-07-15', revenue: 180, show: 'Show B' },
  { date: '2024-07-20', revenue: 350, show: 'Show C' }, { date: '2024-07-21', revenue: 450, show: 'Show A' },
].map(d => ({ ...d, dateObj: new Date(d.date) })).sort((a,b) => a.dateObj.getTime() - b.dateObj.getTime());

const bookingSourceData = [
  { source: 'Website', value: 400 },
  { source: 'Mobile App', value: 300 },
  { source: 'Partner Site', value: 150 },
  { source: 'Offline/Bulk', value: 80 },
];

const demographicData = [ // Example: Bookings by Age Group
    { ageGroup: '18-24', count: 150 },
    { ageGroup: '25-34', count: 350 },
    { ageGroup: '35-44', count: 200 },
    { ageGroup: '45-54', count: 100 },
    { ageGroup: '55+', count: 30 },
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
// --- End Placeholder Data ---

export default function AdminAnalyticsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30), // Default to last 30 days
    to: new Date(),
  });

   // Filter data based on date range (Client-side filtering for demo)
   const filteredRevenueData = detailedRevenueData.filter(d =>
       dateRange?.from && dateRange?.to && d.dateObj >= dateRange.from && d.dateObj <= dateRange.to
   );

   // Aggregate revenue by date for the line chart
   const aggregatedRevenueByDate = filteredRevenueData.reduce((acc, curr) => {
     const dateStr = format(curr.dateObj, 'yyyy-MM-dd');
     acc[dateStr] = (acc[dateStr] || 0) + curr.revenue;
     return acc;
   }, {} as Record<string, number>);

   const lineChartData = Object.entries(aggregatedRevenueByDate).map(([date, revenue]) => ({ date, revenue })).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Event Analytics</h1>
         {/* Date Range Picker */}
         <Popover>
           <PopoverTrigger asChild>
             <Button
               id="date"
               variant={"outline"}
               className={cn(
                 "w-full md:w-[300px] justify-start text-left font-normal",
                 !dateRange && "text-muted-foreground"
               )}
             >
               <CalendarIcon className="mr-2 h-4 w-4" />
               {dateRange?.from ? (
                 dateRange.to ? (
                   <>
                     {format(dateRange.from, "LLL dd, y")} -{" "}
                     {format(dateRange.to, "LLL dd, y")}
                   </>
                 ) : (
                   format(dateRange.from, "LLL dd, y")
                 )
               ) : (
                 <span>Pick a date range</span>
               )}
             </Button>
           </PopoverTrigger>
           <PopoverContent className="w-auto p-0" align="end">
             <UiCalendar
               initialFocus
               mode="range"
               defaultMonth={dateRange?.from}
               selected={dateRange}
               onSelect={setDateRange}
               numberOfMonths={2}
             />
           </PopoverContent>
         </Popover>
      </div>


      {/* Overview Stats */}
       {/* (Re-use or adapt stats cards from dashboard if needed) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {/* Example Stats Cards specific to Analytics */}
         <Card>
           <CardHeader className="pb-2">
             <CardDescription>Total Revenue (Selected Period)</CardDescription>
             <CardTitle className="text-3xl">${filteredRevenueData.reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-xs text-muted-foreground">Compared to previous period</div>
           </CardContent>
         </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg. Ticket Price</CardDescription>
              <CardTitle className="text-3xl">$55.75</CardTitle> {/* Placeholder */}
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Across all shows</div>
            </CardContent>
          </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardDescription>Peak Booking Day</CardDescription>
               <CardTitle className="text-3xl">Friday</CardTitle> {/* Placeholder */}
             </CardHeader>
             <CardContent>
               <div className="text-xs text-muted-foreground">Most popular day for bookings</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardDescription>Discount Usage Rate</CardDescription>
               <CardTitle className="text-3xl">12.5%</CardTitle> {/* Placeholder */}
             </CardHeader>
             <CardContent>
               <div className="text-xs text-muted-foreground">Percentage of bookings using discounts</div>
             </CardContent>
           </Card>
       </div>


      {/* Detailed Charts */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
         <Card className="col-span-1 lg:col-span-2">
           <CardHeader>
             <CardTitle>Revenue Trend (Selected Period)</CardTitle>
             <CardDescription>Daily revenue breakdown.</CardDescription>
           </CardHeader>
           <CardContent className="pl-2 pr-4">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" stroke="#888888" fontSize={10} tickFormatter={(val) => format(new Date(val), 'MMM d')} tickLine={false} axisLine={false} angle={-30} textAnchor="end" height={40}/>
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`}/>
                  <Tooltip
                     contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                     labelStyle={{ color: 'hsl(var(--foreground))' }}
                     itemStyle={{ color: 'hsl(var(--primary))' }}
                     formatter={(value: number) => `$${value.toLocaleString()}`}
                     labelFormatter={(label) => format(new Date(label), 'eeee, MMM d, yyyy')}
                   />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 6 }} name="Daily Revenue"/>
                </LineChart>
              </ResponsiveContainer>
           </CardContent>
         </Card>

          <Card>
           <CardHeader>
             <CardTitle>Booking Sources</CardTitle>
             <CardDescription>Distribution of bookings by source.</CardDescription>
           </CardHeader>
           <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                 <PieChart>
                   <Pie
                     data={bookingSourceData}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     outerRadius={100}
                     fill="#8884d8"
                     dataKey="value"
                     label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                         const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                         const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                         const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                         return (
                           <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                             {`${(percent * 100).toFixed(0)}%`}
                           </text>
                         );
                     }}
                   >
                     {bookingSourceData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString()} bookings`} />
                   <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                 </PieChart>
              </ResponsiveContainer>
           </CardContent>
         </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
              <CardDescription>Bookings by Age Group (Example).</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pr-4">
               <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={demographicData} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                     <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis dataKey="ageGroup" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={60} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} bookings`} />
                      <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} name="Bookings">
                          {demographicData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                      </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
          </Card>

      </div>

      {/* TODO: Add more analytics sections: Ticket Sales by Show, Peak Booking Times, Discount Code Performance, Refund Analysis */}
    </div>
  );
}
