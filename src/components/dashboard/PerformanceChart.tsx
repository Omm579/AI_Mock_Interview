import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Interview } from '../../types';

interface PerformanceChartProps {
  interviews: Interview[];
}

interface ChartData {
  name: string;
  score: number;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ interviews }) => {
  const data: ChartData[] = interviews
    .slice() // Create a copy
    .sort((a, b) => new Date(a.session.startTime).getTime() - new Date(b.session.startTime).getTime())
    .map((interview) => ({
      name: new Date(interview.session.startTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      score: interview.score,
    }));

  return (
    <div className="card p-6">
      <h3 className="heading-3 mb-4">Your Performance</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Score']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="score" 
              fill="#4F46E5"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;