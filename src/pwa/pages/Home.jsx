import { useState, useEffect } from 'react';
import { subscribeToReports, upvoteReport } from '../../firebase/services';
import { Bell, Search, MapPin, ChevronUp, Clock } from 'lucide-react';

export default function Home() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToReports(data => {
      setReports(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpvote = async (id) => {
    await upvoteReport(id);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* Header */}
      <div className="bg-saffron text-white p-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6 mt-2">
          <div>
            <h1 className="text-sm opacity-90">Good Morning,</h1>
            <h2 className="text-2xl font-bold tracking-tight">Citizen</h2>
          </div>
          <div className="relative bg-white/20 p-2 rounded-full">
            <Bell size={24} />
            <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-saffron"></span>
            </span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search reports by area or category..." 
            className="w-full bg-white text-slate-900 rounded-xl py-3 pl-11 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-white border-none placeholder-gray-400"
          />
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 p-5 space-y-5">
        <div className="flex justify-between items-end mb-2">
          <h3 className="font-semibold text-slate-800 text-lg">Live updates near you</h3>
          <button 
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=civic+issues+near+me', '_blank')} 
            className="text-xs font-bold text-indiaGreen uppercase tracking-wide hover:underline"
          >
            View Map
          </button>
        </div>

        {loading ? (
           [1,2,3].map(i => (
             <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
               <div className="h-44 bg-slate-200"></div>
               <div className="p-4 space-y-3">
                 <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-200 rounded w-full"></div>
                 <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                 <div className="flex justify-between pt-2">
                   <div className="h-8 bg-slate-200 rounded w-20"></div>
                   <div className="h-8 bg-slate-200 rounded w-16"></div>
                 </div>
               </div>
             </div>
           ))
        ) : reports.length === 0 ? (
           <div className="text-center py-10 text-slate-400 font-semibold bg-white rounded-2xl border border-slate-100 border-dashed">No issues reported yet. Check back soon.</div>
        ) : reports.map((report) => (
          <div key={report.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative h-44 bg-slate-200 group">
              <img src={report.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1541888031525-452fdeabf3d8?auto=format&fit=crop&q=80'} alt={report.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10 ${
                  report.priority === 'High' ? 'bg-red-500 text-white' : 
                  report.priority === 'Medium' ? 'bg-orange-500 text-white' : 
                  'bg-indiaGreen text-white'
                }`}>
                  {report.priority}
                </span>
                <span className="bg-white/90 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm z-10">
                  {report.category}
                </span>
              </div>
              <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1.5 shadow-sm uppercase tracking-wide z-10">
                <div className={`w-2 h-2 rounded-full shadow-inner ${
                  report.status === 'Resolved' ? 'bg-green-500' :
                  report.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-400'
                }`}></div>
                {report.status}
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-slate-900 text-[17px] leading-tight mb-1.5">{report.title}</h4>
              <p className={`text-sm text-slate-500 mb-4 leading-relaxed transition-all ${expandedId === report.id ? '' : 'line-clamp-2'}`}>
                {report.description}
              </p>
              
              <div className="flex items-center gap-4 text-[13px] font-medium text-slate-400 mb-4">
                <div className="flex items-center gap-1 max-w-[60%]"><MapPin size={14} className="flex-shrink-0 text-slate-400"/> <span className="truncate">{report.location?.address || `${report.location?.lat ? report.location.lat.toFixed(4) : 0}, ${report.location?.lng ? report.location.lng.toFixed(4) : 0}`}</span></div>
                <div className="flex items-center gap-1"><Clock size={14} className="text-slate-400"/> <span>{report.createdAtStr?.split ? report.createdAtStr.split(',')[0] : "Just now"}</span></div>
              </div>

              <div className="flex items-center justify-between pt-3.5 border-t border-slate-50">
                <button 
                  onClick={() => handleUpvote(report.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors text-sm font-semibold border border-slate-100 active:scale-95 duration-100"
                >
                  <ChevronUp size={18} className="text-saffron" strokeWidth={3} />
                  {report.upvotes || 0}
                </button>
                <button 
                  onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
                  className="text-indiaGreen text-sm font-bold tracking-wide hover:text-green-700 transition-colors px-2 py-1"
                >
                  {expandedId === report.id ? 'LESS' : 'DETAILS'}
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="h-6"></div>
      </div>
    </div>
  );
}
