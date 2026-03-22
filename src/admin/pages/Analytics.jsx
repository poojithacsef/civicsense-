import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, Share2, TrendingDown, TrendingUp, AlertOctagon } from 'lucide-react';
import { subscribeToReports } from '../../firebase/services';

const COLORS = ['#138808', '#FF9933', '#64748b', '#3b82f6', '#ef4444']; // Extended for statuses

// Dummy trend data since we don't have historical days easily without heavier logic
const trendData = [
  { name: 'Mon', reports: 40 },
  { name: 'Tue', reports: 30 },
  { name: 'Wed', reports: 45 },
  { name: 'Thu', reports: 50 },
  { name: 'Fri', reports: 65 },
  { name: 'Sat', reports: 85 },
  { name: 'Sun', reports: 70 },
];

export default function Analytics() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToReports(setReports);
    return () => unsubscribe();
  }, []);

  const { statusData, categoryData, kpis } = useMemo(() => {
    if (!reports.length) return { statusData: [], categoryData: [], kpis: [] };

    const statusCounts = {};
    const categoryCounts = {};
    let highPriorityCount = 0;
    let resolvedCount = 0;

    reports.forEach(r => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      if (r.priority === 'High') highPriorityCount++;
      if (r.status === 'Resolved') resolvedCount++;
    });

    const sData = Object.keys(statusCounts).map(k => ({ name: k, value: statusCounts[k] }));
    const cData = Object.keys(categoryCounts).map(k => ({ name: k, value: categoryCounts[k] })).sort((a,b)=>b.value-a.value).slice(0,5);

    const kData = [
      { title: "Total Reports", value: reports.length.toString(), trend: "Live", up: true },
      { title: "Avg Resolution", value: "TBD", trend: "-", up: true },
      { title: "High Priority", value: highPriorityCount.toString(), trend: "Live", up: false },
      { title: "Resolved Total", value: resolvedCount.toString(), trend: "Live", up: true }
    ];

    return { statusData: sData, categoryData: cData, kpis: kData };
  }, [reports]);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time civic data metrics from Firestore.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-sm">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 bg-saffron border border-orange-500 px-4 py-2 rounded-xl shadow-[0_4px_12px_rgba(255,153,51,0.3)] text-white hover:bg-orange-600 transition-colors font-semibold text-sm">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow animate-in fade-in duration-300">
            {kpi.title === "High Priority" && <div className="absolute top-0 right-0 p-2"><AlertOctagon size={48} className="text-red-500 opacity-[0.03] group-hover:scale-110 group-hover:opacity-10 transition-all duration-500" strokeWidth={3}/></div>}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10">{kpi.title}</span>
            <div className="flex items-end gap-3 mt-1 relative z-10">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
              <span className={`flex items-center text-xs font-bold mb-1.5 px-2 py-0.5 rounded-lg border ${kpi.up ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {kpi.up ? <TrendingUp size={12} strokeWidth={3} className="mr-1"/> : <TrendingDown size={12} strokeWidth={3} className="mr-1"/>}
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[400px]">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-3">Reports Trend (Last 7 Days)</h3>
          <div className="flex-1 min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{top:10, right:10, left:-20, bottom:0}}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight:600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight:600}} />
                <Tooltip cursor={{stroke: '#f1f5f9', strokeWidth: 2}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 600 }}/>
                <Line type="basis" dataKey="reports" stroke="#FF9933" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'white' }} activeDot={{ r: 6, fill: '#FF9933', stroke: 'white', strokeWidth: 2 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-2 relative z-10 border-b border-slate-50 pb-3">Status Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
             <div className="w-full h-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 10px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{fontWeight: 700, fontSize: '13px'}}/>
                </PieChart>
              </ResponsiveContainer>
             </div>
             
             <div className="w-full flex justify-center gap-3 mt-4 flex-wrap">
                {statusData.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                    {s.name}
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[250px] flex flex-col">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-50 pb-3">Top Categories</h3>
          <div className="flex-1 w-full min-h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{top: 0, right: 30, left: 10, bottom: 0}}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 700}} width={70} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', boxShadow: 'none' }}/>
                <Bar dataKey="value" fill="#138808" radius={[0, 6, 6, 0]} barSize={20} animationDuration={1000}>
                  {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? '#138808' : index === 1 ? '#22c55e' : '#86efac'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
